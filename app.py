from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
import joblib
from datetime import date
from pathlib import Path
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'weather-app-secret-key-2024')

# Get current directory
current_dir = Path(__file__).parent

print("🔄 Starting Weather Prediction App...")

# Initialize variables
rf_model = None
scaler = None
le = None
X = None

# ==== Load model dan data ====
try:
    print("🔄 Loading machine learning models...")
    rf_model = joblib.load(current_dir / "rf_weather_model.pkl")
    scaler = joblib.load(current_dir / "scaler.pkl")
    le = joblib.load(current_dir / "label_encoder.pkl")
    print("✅ Models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")

try:
    print("🔄 Loading weather data...")
    df = pd.read_csv(current_dir / "seattle-weather.csv")
    df = df.dropna(axis=1, how="all")
    X = df.drop(columns=['weather'])
    X['date'] = pd.to_datetime(X['date'])
    X['month'] = X['date'].dt.month
    X['day'] = X['date'].dt.day
    X = X.drop(columns=['date'])
    print("✅ Weather data loaded successfully")
except Exception as e:
    print(f"❌ Error loading weather data: {e}")

# ==== Data pengguna ====
users = {
    "admin": "admin123",
    "user": "user123"
}

# ==== Fungsi prediksi ====
def predict_weather(tanggal_input):
    if rf_model is None or scaler is None or le is None or X is None:
        return {"error": "Sistem prediksi sedang tidak tersedia"}
    
    try:
        date_obj = pd.to_datetime(tanggal_input)
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
        
        return {
            "tanggal": tanggal_input, 
            "prediksi_cuaca": label,
            "status": "success"
        }
    
    except Exception as e:
        return {"error": f"Gagal memprediksi: {str(e)}"}

# ==== Routes ====
@app.route('/')
def home():
    return redirect(url_for('login'))

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

@app.route('/dashboard')
def user_dashboard():
    if 'logged_in' in session and session['username'] == 'user':
        today = date.today().strftime('%Y-%m-%d')
        current_weather = predict_weather(today)
        return render_template('index.html', 
                             username=session['username'], 
                             current_weather=current_weather)
    return redirect(url_for('login'))

@app.route('/admin')
def admin_dashboard():
    if 'logged_in' in session and session['username'] == 'admin':
        try:
            weather_data = pd.read_csv(current_dir / "seattle-weather.csv").to_dict('records')
            return render_template('admin_page.html', 
                                 username=session['username'], 
                                 data=weather_data)
        except Exception as e:
            return render_template('admin_page.html', 
                                 username=session['username'], 
                                 data=[], 
                                 error=str(e))
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/predict', methods=['POST'])
def predict():
    if 'logged_in' in session:
        data = request.get_json()
        tanggal = data.get('date', '')
        if not tanggal:
            return jsonify({"error": "Tanggal tidak boleh kosong"})
        
        result = predict_weather(tanggal)
        return jsonify(result)
    return jsonify({"error": "Silakan login terlebih dahulu"}), 401

@app.route('/health')
def health_check():
    return jsonify({
        "status": "running",
        "models_loaded": rf_model is not None,
        "data_loaded": X is not None,
        "message": "Weather Prediction App is working!"
    })

@app.route('/test')
def test_page():
    return """
    <h1>Weather App Test Page ✅</h1>
    <p>Flask is working perfectly!</p>
    <p><a href="/login">Go to Login Page</a></p>
    <p><a href="/health">Check Health Status</a></p>
    <p>If you see this page, deployment is successful!</p>
    """

# Tambahkan bagian ini di BAWAH untuk Railway deployment
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
