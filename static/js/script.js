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

// Fungsi untuk format tanggal
function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
    
    // Set tanggal maksimal (opsional: 1 tahun ke depan)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365); // 1 tahun ke depan
    const maxFormattedDate = maxDate.toISOString().split('T')[0];
    dateInput.max = maxFormattedDate;
    
    // Event listener untuk tanggal berubah
    dateInput.addEventListener('change', function() {
        if (this.value) {
            const formatted = formatDateForDisplay(this.value);
            console.log('Tanggal dipilih:', formatted);
        }
    });
    
    // Event listener untuk klik (untuk mobile)
    dateInput.addEventListener('click', function(e) {
        // Di mobile, kita bisa memberikan feedback
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        setTimeout(() => {
            this.style.backgroundColor = '';
        }, 200);
    });
    
    // Event listener untuk focus
    dateInput.addEventListener('focus', function() {
        this.style.borderColor = '#4CAF50';
        this.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';
    });
    
    dateInput.addEventListener('blur', function() {
        this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        this.style.boxShadow = 'none';
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
    
    // Force reflow untuk memastikan icon muncul di mobile
    setTimeout(() => {
        dateInput.style.display = 'none';
        dateInput.offsetHeight; // Trigger reflow
        dateInput.style.display = '';
    }, 100);
}

// Jalankan inisialisasi saat halaman siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Fungsi fallback untuk FontAwesome
function checkFontAwesomeLoaded() {
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'FallbackIcons';
            src: url("data:application/x-font-woff;charset=utf-8;base64,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") format('woff');
            font-weight: normal;
            font-style: normal;
        }
        
        .fallback-icon::before {
            content: "📅";
            font-family: Arial, sans-serif;
        }
    `;
    document.head.appendChild(style);
}

// Tambahkan fallback icon jika FontAwesome tidak tersedia
window.addEventListener('load', function() {
    // Cek apakah FontAwesome sudah dimuat
    setTimeout(() => {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-calendar-alt';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        document.body.appendChild(testIcon);
        
        const computedStyle = window.getComputedStyle(testIcon);
        const fontFamily = computedStyle.fontFamily;
        
        if (!fontFamily.includes('Font Awesome')) {
            // FontAwesome tidak dimuat, gunakan fallback
            const dateWrappers = document.querySelectorAll('.date-input-wrapper');
            dateWrappers.forEach(wrapper => {
                const fallbackIcon = document.createElement('span');
                fallbackIcon.className = 'calendar-icon fallback-icon';
                wrapper.appendChild(fallbackIcon);
            });
        }
        
        document.body.removeChild(testIcon);
    }, 1000);
});

// Export fungsi jika diperlukan (untuk modular)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateWeatherDisplay,
        predictWeather,
        initializePage
    };
}
