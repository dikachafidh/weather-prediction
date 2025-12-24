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
        details: `"Salju turun lembut… beda sama tugas yang turun bertubi-tubi."`
    }
};

function updateWeatherDisplay(weather) {
    const body = document.getElementById('weather-body');
    const weatherText = document.getElementById('weather-text');
    const weatherDetails = document.getElementById('weather-details');
    
    // Hapus semua kelas cuaca yang ada
    for (let key in weatherData) {
        body.classList.remove(weatherData[key].className);
    }
    
    const data = weatherData[weather.toLowerCase()];
    
    if (data) {
        body.classList.add(data.className);
        weatherText.innerHTML = data.text;
        weatherDetails.innerHTML = `<p>${data.details}</p>`;
    } else {
        body.classList.add('default');
        weatherText.innerHTML = `- Cuaca tidak diketahui -`;
        weatherDetails.innerHTML = `<p>Maaf, kami tidak memiliki data visual untuk cuaca ini.</p>`;
    }
}

// Fungsi baru untuk inisialisasi tampilan cuaca saat halaman dimuat
function initializeWeather(weather) {
    updateWeatherDisplay(weather);
}

async function predictWeather() {
    const dateInput = document.getElementById('searchDate').value;
    const resultDiv = document.getElementById('prediction-result');
    
    if (!dateInput) {
        resultDiv.innerHTML = "<p style='color: red;'>Harap pilih tanggal terlebih dahulu.</p>";
        return;
    }

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: dateInput }),
        });
        
        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `<p style='color: red;'>${data.error}</p>`;
        } else {
            // Format tanggal dari database ke format yang lebih mudah dibaca
            const dateObj = new Date(data.tanggal);
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Tampilkan parameter cuaca seperti pada gambar
            resultDiv.innerHTML = `
                <div class="weather-params">
                    <h3 style="margin-bottom: 15px; text-align: center;">Prediksi Cuaca</h3>
                    <div class="weather-grid">
                        <div class="weather-item">
                            <i class="fas fa-thermometer-half"></i>
                            <div>
                                <p class="param-label">Suhu Maksimum</p>
                                <p class="param-value">${data.temp_max}°C</p>
                            </div>
                        </div>
                        <div class="weather-item">
                            <i class="fas fa-thermometer-quarter"></i>
                            <div>
                                <p class="param-label">Suhu Minimum</p>
                                <p class="param-value">${data.temp_min}°C</p>
                            </div>
                        </div>
                        <div class="weather-item">
                            <i class="fas fa-cloud-rain"></i>
                            <div>
                                <p class="param-label">Curah Hujan</p>
                                <p class="param-value">${data.precipitation} inch</p>
                            </div>
                        </div>
                        <div class="weather-item">
                            <i class="fas fa-wind"></i>
                            <div>
                                <p class="param-label">Kecepatan Angin</p>
                                <p class="param-value">${data.wind} mph</p>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9em; text-align: center; color: rgba(255,255,255,0.8);">
                        <p><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
                    </div>
                </div>
            `;
            
            // Update tampilan background sesuai cuaca
            updateWeatherDisplay(data.prediksi_cuaca);
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style='color: red;'>Terjadi kesalahan saat melakukan prediksi.</p>`;
        console.error('Error:', error);
    }
}
