// Data cuaca untuk tampilan
const weatherData = {
    'sun': {
        className: 'cerah',
        text: `- Sun - <span></span><i class="fas fa-sun"></i>`,
        details: `"Panasnya siang ini bikin aku sadar: hidup sudah cukup sulit tanpa harus meleleh."`
    },
    'rain': {
        className: 'hujan',
        text: `- Rain - <span></span><i class="fas fa-cloud-showers-heavy"></i>`,
        details: `"Hujan bikin ngantuk, tugas bikin panik. Kombinasi yang tidak manusiawi."`
    },
    'drizzle': {
        className: 'gerimis',
        text: `- Drizzle - <span></span><i class="fas fa-cloud-sun-rain"></i>`,
        details: `"Gerimis sambil ngopi itu enak, tapi ngopi sambil mikir tugas… beda cerita."`
    },
    'fog': {
        className: 'kabut',
        text: `- Fog - <span></span><i class="fas fa-smog"></i>`,
        details: `"Jalannya berkabut, seperti tugasku… sama-sama nggak kelihatan ujungnya."`
    },
    'snow': {
        className: 'salju',
        text: `- Snow - <span></span><i class="fas fa-snowflake"></i>`,
        details: `"Salju turun lembut… beda sama tugas yang turun bertubi-tubi."`
    },
    'default': {
        className: 'default',
        text: `- Pilih Tanggal - <span></span><i class="fas fa-calendar-alt"></i>`,
        details: `"Silakan pilih tanggal untuk melihat prediksi cuaca Seattle."`
    }
};

// Fungsi untuk update tampilan cuaca
function updateWeatherDisplay(weatherType) {
    const body = document.getElementById('weather-body');
    const weatherText = document.getElementById('weather-text');
    const weatherDetails = document.getElementById('weather-details');
    const predictionResult = document.getElementById('prediction-result');
    
    // Hapus semua kelas cuaca yang ada
    for (let key in weatherData) {
        body.classList.remove(weatherData[key].className);
    }
    
    // Gunakan weatherType langsung (misalnya: 'sun', 'rain', dll)
    const data = weatherData[weatherType] || weatherData['default'];
    
    // Apply theme dan update display
    body.classList.add(data.className);
    weatherText.innerHTML = data.text;
    
    // Tampilkan weather details hanya jika bukan default
    if (weatherType && weatherType !== 'default') {
        weatherDetails.innerHTML = `<p>${data.details}</p>`;
        weatherDetails.classList.add('has-content');
    } else {
        weatherDetails.classList.remove('has-content');
        weatherDetails.innerHTML = '';
    }
    
    // Sembunyikan prediction result jika default
    if (!weatherType || weatherType === 'default') {
        predictionResult.classList.remove('has-content');
        predictionResult.innerHTML = '';
    }
}

// Fungsi untuk prediksi cuaca
async function predictWeather() {
    const dateInput = document.getElementById('searchDate');
    const resultDiv = document.getElementById('prediction-result');
    const weatherDetails = document.getElementById('weather-details');
    
    // Validasi input tanggal
    if (!dateInput.value) {
        resultDiv.innerHTML = `<div class="error-message">Harap pilih tanggal terlebih dahulu.</div>`;
        resultDiv.classList.add('has-content');
        updateWeatherDisplay('default');
        return;
    }

    try {
        // Tampilkan loading state
        resultDiv.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Memproses prediksi...
            </div>
        `;
        resultDiv.classList.add('has-content');
        
        // Kirim request ke backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: dateInput.value }),
        });
        
        const data = await response.json();
        
        if (data.error) {
            // Tampilkan error
            resultDiv.innerHTML = `<div class="error-message">${data.error}</div>`;
            updateWeatherDisplay('default');
        } else {
            // Format hasil prediksi
            const tanggal = data.tanggal;
            const prediksi = data.prediksi_cuaca;
            
            // Ambil jenis cuaca untuk background
            const weatherType = prediksi.toLowerCase();
            
            // Update tampilan dengan hasil prediksi
            resultDiv.innerHTML = `
                <div style="animation: fadeIn 0.5s ease-out;">
                    <h3 class="prediction-title">Hasil Prediksi Cuaca</h3>
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="result-label">🌡️ Suhu Maks</span>
                            <span class="result-value">${data.temp_max}°C</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">🌡️ Suhu Min</span>
                            <span class="result-value">${data.temp_min}°C</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">💧 Curah Hujan</span>
                            <span class="result-value">${data.precipitation}"</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">💨 Kecepatan Angin</span>
                            <span class="result-value">${data.wind} mph</span>
                        </div>
                    </div>
                    <div class="prediction-summary">
                        Prediksi cuaca: <strong>${prediksi}</strong>
                    </div>
                </div>
            `;
            
            // Tampilkan weather details dengan quotes
            weatherDetails.classList.add('has-content');
            
            // Update tampilan background dan cuaca
            updateWeatherDisplay(weatherType);
        }
    } catch (error) {
        // Tangani error jaringan
        resultDiv.innerHTML = `
            <div class="error-message">
                Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.
            </div>
        `;
        resultDiv.classList.add('has-content');
        updateWeatherDisplay('default');
        console.error('Error:', error);
    }
}

// Fungsi untuk inisialisasi saat halaman dimuat
function initializePage() {
    // Set tanggal input ke hari ini sebagai default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const dateInput = document.getElementById('searchDate');
    dateInput.value = formattedDate;
    
    // Set tanggal minimum ke hari ini (tidak bisa pilih tanggal kemarin)
    dateInput.min = formattedDate;
    
    // Set tanggal maksimal (opsional: 30 hari ke depan)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365); // 1 tahun ke depan
    const maxFormattedDate = maxDate.toISOString().split('T')[0];
    dateInput.max = maxFormattedDate;
    
    // Event listener untuk placeholder
    dateInput.addEventListener('focus', function() {
        if (!this.value) {
            this.classList.add('placeholder-active');
        }
    });
    
    dateInput.addEventListener('blur', function() {
        this.classList.remove('placeholder-active');
    });
    
    // Inisialisasi tampilan default
    updateWeatherDisplay('default');
    
    // Event listener untuk tombol prediksi
    document.querySelector('button').addEventListener('click', predictWeather);
    
    // Event listener untuk enter key pada input tanggal
    dateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            predictWeather();
        }
    });
}

// Jalankan inisialisasi saat halaman siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Fungsi untuk mengubah tema berdasarkan input pengguna (optional)
function changeThemeManually(themeName) {
    const body = document.getElementById('weather-body');
    
    // Hapus semua kelas tema
    body.className = '';
    
    // Tambahkan kelas tema yang dipilih
    if (weatherData[themeName]) {
        body.classList.add(weatherData[themeName].className);
    } else {
        body.classList.add('default');
    }
}

// Export fungsi jika diperlukan (untuk modular)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateWeatherDisplay,
        predictWeather,
        initializePage
    };
}
