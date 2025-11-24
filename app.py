from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
import joblib
from datetime import date # Impor modul date

app = Flask(__name__)
app.secret_key = 'kunci_rahasia_anda_yang_sangat_aman'

# ==== Load model, scaler, dan label encoder ====
try:
    rf_model = joblib.load("rf_weather_model.pkl")
    scaler = joblib.load("scaler.pkl")
    le = joblib.load("label_encoder.pkl")
    print("Model, scaler, dan label encoder berhasil dimuat.")
except FileNotFoundError:
    print("Error: Satu atau lebih file model tidak ditemukan. Harap jalankan model_training.py terlebih dahulu.")
    exit()

# Mengambil data historis untuk perhitungan mean
try:
    df = pd.read_csv("seattle-weather.csv")
    df = df.dropna(axis=1, how="all")
    X = df.drop(columns=['weather'])
    X['date'] = pd.to_datetime(X['date'])
    X['month'] = X['date'].dt.month
    X['day'] = X['date'].dt.day
    X = X.drop(columns=['date'])
except FileNotFoundError:
    print("Error: seattle-weather.csv tidak ditemukan.")
    exit()

# ==== Data pengguna (simulasi database) ====
users = {
    "admin": "admin123",
    "user": "user123"
}

# ==== Fungsi untuk prediksi cuaca ====
def predict_weather(tanggal_input):
    try:
        date_obj = pd.to_datetime(tanggal_input)
    except:
        return {"error": "Format tanggal salah. Gunakan format YYYY-MM-DD."}
    
    month = date_obj.month
    day = date_obj.day
    
    subset = X[(X['month'] == month) & (X['day'] == day)]
    
    if subset.empty:
        precipitation = X['precipitation'].mean()
        temp_max = X['temp_max'].mean()
        temp_min = X['temp_min'].mean()
        wind = X['wind'].mean()
    else:
        precipitation = subset['precipitation'].mean()
        temp_max = subset['temp_max'].mean()
        temp_min = subset['temp_min'].mean()
        wind = subset['wind'].mean()
    
    new_data_avg = pd.DataFrame({
        'precipitation': [precipitation],
        'temp_max': [temp_max],
        'temp_min': [temp_min],
        'wind': [wind],
        'month': [month],
        'day': [day]
    })
    
    new_data_scaled = scaler.transform(new_data_avg)
    pred = rf_model.predict(new_data_scaled)
    label = le.inverse_transform(pred)[0]
    
    return {"tanggal": tanggal_input, "prediksi_cuaca": label}

# Rute utama yang akan mengarahkan ke login
@app.route('/')
def home():
    return redirect(url_for('login'))

# Rute untuk login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'logged_in' in session:
        if session['username'] == 'admin':
            return redirect(url_for('admin_dashboard'))
        else:
            return redirect(url_for('user_dashboard'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            session['logged_in'] = True
            session['username'] = username
            if username == 'admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('user_dashboard'))
        return render_template('login.html', error='Username atau password salah!')
    
    return render_template('login.html')

# Rute untuk dashboard user
@app.route('/dashboard')
def user_dashboard():
    if 'logged_in' in session and session['username'] == 'user':
        today = date.today().strftime('%Y-%m-%d')
        # Prediksi cuaca untuk tanggal hari ini
        current_weather = predict_weather(today)
        return render_template('index.html', username=session['username'], current_weather=current_weather)
    return redirect(url_for('login'))

# Rute untuk dashboard admin
@app.route('/admin')
def admin_dashboard():
    if 'logged_in' in session and session['username'] == 'admin':
        # Baca data CSV dan kirim ke template
        weather_data = pd.read_csv("seattle-weather.csv").to_dict('records')
        return render_template('admin_page.html', username=session['username'], data=weather_data)
    return redirect(url_for('login'))

# Rute untuk logout
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect(url_for('login'))

# Rute prediksi cuaca (dilindungi)
@app.route('/predict', methods=['POST'])
def predict():
    if 'logged_in' in session:
        data = request.get_json()
        tanggal = data['date']
        result = predict_weather(tanggal)
        return jsonify(result)
    return jsonify({"error": "Unauthorized"}), 401

if __name__ == '__main__':
    app.run(debug=True)