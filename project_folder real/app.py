from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
import joblib
from datetime import date
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'kunci_rahasia_anda_yang_sangat_aman')

# ==== Load model, scaler, dan label encoder ====
try:
    rf_model = joblib.load("rf_weather_model.pkl")
    scaler = joblib.load("scaler.pkl")
    le = joblib.load("label_encoder.pkl")
    print("Model, scaler, dan label encoder berhasil dimuat.")
except FileNotFoundError as e:
    print(f"Error loading model files: {e}")
    # Jangan exit() di Vercel, biarkan aplikasi tetap running
    rf_model = None
    scaler = None
    le = None

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
    X = None

# ==== Data pengguna (simulasi database) ====
users = {
    "admin": "admin123",
    "user": "user123"
}

# ==== Fungsi untuk prediksi cuaca ====
def predict_weather(tanggal_input):
    # Cek jika model tidak terload
    if rf_model is None or scaler is None or le is None:
        return {"error": "Model belum siap. Silakan coba lagi nanti."}
    
    if X is None:
        return {"error": "Data historis tidak tersedia."}
    
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
        try:
            # Baca data CSV dan kirim ke template
            weather_data = pd.read_csv("seattle-weather.csv").to_dict('records')
            return render_template('admin_page.html', username=session['username'], data=weather_data)
        except Exception as e:
            return render_template('admin_page.html', username=session['username'], data=[], error=str(e))
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

# Health check route untuk Vercel
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"})

# Tambahkan ini di bagian paling bawah
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)