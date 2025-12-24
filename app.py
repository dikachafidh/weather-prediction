from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import pandas as pd
import joblib
from datetime import date
import warnings
import traceback
import os

app = Flask(__name__)
app.secret_key = 'kunci_rahasia_anda_yang_sangat_aman'

# ==== Load model, scaler, dan label encoder dengan error handling ====
def load_models():
    global rf_model, scaler, le, df, X
    
    try:
        # Coba load dengan ignore warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            rf_model = joblib.load("rf_weather_model.pkl")
            scaler = joblib.load("scaler.pkl")
            le = joblib.load("label_encoder.pkl")
        print("Model, scaler, dan label encoder berhasil dimuat.")
        
        # Load data historis
        df = pd.read_csv("seattle-weather.csv")
        df = df.dropna(axis=1, how="all")
        X = df.drop(columns=['weather'])
        X['date'] = pd.to_datetime(X['date'])
        X['month'] = X['date'].dt.month
        X['day'] = X['date'].dt.day
        X = X.drop(columns=['date'])
        
        print(f"Dataset loaded: {len(df)} records")
        print(f"Columns: {list(X.columns)}")
        
    except FileNotFoundError as e:
        print(f"Error: File tidak ditemukan - {e}")
        exit()
    except Exception as e:
        print(f"Error loading models: {e}")
        print("Traceback:")
        traceback.print_exc()
        print("\nMencoba load dengan compatibility mode...")
        
        # Coba load dengan compatibility mode
        try:
            rf_model = joblib.load("rf_weather_model.pkl", mmap_mode=None)
            scaler = joblib.load("scaler.pkl", mmap_mode=None)
            le = joblib.load("label_encoder.pkl", mmap_mode=None)
            print("Berhasil load dengan compatibility mode!")
        except Exception as e2:
            print(f"Masih error: {e2}")
            exit()

# Panggil fungsi load
load_models()

# ==== Data pengguna (simulasi database) ====
users = {
    "admin": "admin123",
    "user": "user123"
}

# ==== Fungsi untuk prediksi cuaca (DIPERBAIKI) ====
def predict_weather(tanggal_input):
    try:
        date_obj = pd.to_datetime(tanggal_input)
    except Exception as e:
        print(f"Error parsing date: {e}")
        return {"error": "Format tanggal salah. Gunakan format YYYY-MM-DD."}
    
    month = date_obj.month
    day = date_obj.day
    
    print(f"\n{'='*60}")
    print(f"PREDIKSI UNTUK: {tanggal_input} (Bulan: {month}, Hari: {day})")
    print(f"{'='*60}")
    
    # Cari data pada bulan dan hari yang sama
    subset = X[(X['month'] == month) & (X['day'] == day)]
    
    if subset.empty:
        print("⚠️  Data tidak ditemukan untuk tanggal ini, menggunakan rata-rata keseluruhan")
        precipitation = X['precipitation'].mean()
        temp_max = X['temp_max'].mean()
        temp_min = X['temp_min'].mean()
        wind = X['wind'].mean()
    else:
        print(f"✓ Data ditemukan: {len(subset)} record(s)")
        precipitation = subset['precipitation'].mean()
        temp_max = subset['temp_max'].mean()
        temp_min = subset['temp_min'].mean()
        wind = subset['wind'].mean()
    
    print(f"Data Cuaca (sebelum prediksi):")
    print(f"  - Precipitation: {precipitation}")
    print(f"  - Temp Max: {temp_max}")
    print(f"  - Temp Min: {temp_min}")
    print(f"  - Wind: {wind}")
    
    # Buat dataframe untuk prediksi
    new_data_avg = pd.DataFrame({
        'precipitation': [precipitation],
        'temp_max': [temp_max],
        'temp_min': [temp_min],
        'wind': [wind],
        'month': [month],
        'day': [day]
    })
    
    try:
        # Scale data dan lakukan prediksi
        new_data_scaled = scaler.transform(new_data_avg)
        pred = rf_model.predict(new_data_scaled)
        label = le.inverse_transform(pred)[0]
        
        print(f"\n✓ Prediksi Cuaca: {label}")
        
        # PERBAIKAN UTAMA: Pastikan semua nilai valid dan dalam format yang benar
        result = {
            "tanggal": str(tanggal_input),
            "prediksi_cuaca": str(label).lower(),  # lowercase untuk matching di frontend
            "precipitation": float(round(precipitation, 2)) if pd.notna(precipitation) else 0.0,
            "temp_max": float(round(temp_max, 2)) if pd.notna(temp_max) else 0.0,
            "temp_min": float(round(temp_min, 2)) if pd.notna(temp_min) else 0.0,
            "wind": float(round(wind, 2)) if pd.notna(wind) else 0.0
        }
        
        print(f"\n📤 Response yang dikirim:")
        for key, value in result.items():
            print(f"  {key}: {value} (type: {type(value).__name__})")
        print(f"{'='*60}\n")
        
        return result
        
    except Exception as e:
        print(f"\n❌ Error dalam prediksi: {str(e)}")
        traceback.print_exc()
        return {"error": f"Prediction error: {str(e)}"}

# ===== RUTE-RUTE APLIKASI =====

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
        current_weather = predict_weather(today)
        
        return render_template('index.html', username=session['username'], current_weather=current_weather)
    return redirect(url_for('login'))

# Rute untuk dashboard admin
@app.route('/admin')
def admin_dashboard():
    if 'logged_in' in session and session['username'] == 'admin':
        try:
            weather_data = pd.read_csv("seattle-weather.csv").to_dict('records')
            return render_template('admin_page.html', username=session['username'], data=weather_data)
        except Exception as e:
            return f"Error loading data: {e}"
    return redirect(url_for('login'))

# Rute untuk riwayat prediksi (Menu Riwayat)
@app.route('/history')
def history():
    if 'logged_in' in session and session['username'] == 'admin':
        try:
            # Simulasi data riwayat prediksi
            # Dalam implementasi nyata, Anda bisa menyimpan riwayat prediksi di database
            history_data = [
                {'tanggal': '2024-01-15', 'prediksi': 'Cerah', 'akurasi': '85%'},
                {'tanggal': '2024-01-16', 'prediksi': 'Hujan', 'akurasi': '78%'},
                {'tanggal': '2024-01-17', 'prediksi': 'Berawan', 'akurasi': '82%'},
                {'tanggal': '2024-01-18', 'prediksi': 'Cerah', 'akurasi': '88%'},
                {'tanggal': '2024-01-19', 'prediksi': 'Hujan', 'akurasi': '75%'},
            ]
            return render_template('history.html', username=session['username'], history_data=history_data)
        except Exception as e:
            return f"Error loading history: {e}"
    return redirect(url_for('login'))

# Rute untuk pengaturan (Menu Pengaturan)
@app.route('/settings')
def settings():
    if 'logged_in' in session and session['username'] == 'admin':
        try:
            # Data pengaturan sistem
            system_info = {
                'model_version': '1.0.0',
                'accuracy': '89%',
                'last_trained': '2024-01-15',
                'data_points': len(df),
                'features': list(X.columns)
            }
            return render_template('settings.html', username=session['username'], system_info=system_info)
        except Exception as e:
            return f"Error loading settings: {e}"
    return redirect(url_for('login'))

# Rute untuk logout
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect(url_for('login'))

# Rute prediksi cuaca (dilindungi) - DIPERBAIKI
@app.route('/predict', methods=['POST'])
def predict():
    if 'logged_in' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        
        if not data or 'date' not in data:
            return jsonify({"error": "Tanggal tidak ditemukan dalam request"}), 400
        
        tanggal = data['date']
        print(f"\n📥 Request diterima untuk tanggal: {tanggal}")
        
        result = predict_weather(tanggal)
        
        # DEBUG: Print result sebelum dikirim
        print(f"\n📤 Sending response:")
        print(f"Type of result: {type(result)}")
        print(f"Result content: {result}")
        
        # Pastikan semua key ada
        if 'temp_max' not in result and 'error' not in result:
            print("⚠️ WARNING: temp_max not in result!")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"\n❌ Error di endpoint /predict: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Error handler
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error - model compatibility issue"}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🌤️  WEATHER PREDICTION APP - FLASK SERVER")
    print("="*60)
    print("Server running on: http://127.0.0.1:5000")
    print("Press CTRL+C to quit")
    print("="*60 + "\n")
    app.run(debug=True)