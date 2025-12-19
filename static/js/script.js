document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully');
    
    // Set tanggal default ke HARI INI (real time)
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    
    const dateInput = document.getElementById('searchDate');
    if (dateInput) {
        // Set tanggal ke hari ini
        dateInput.value = todayFormatted;
        
        // Set tanggal minimum ke hari ini (tidak bisa memilih tanggal kemarin)
        dateInput.setAttribute('min', todayFormatted);
        
        // Set tanggal maksimal 30 hari ke depan (opsional)
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30);
        const maxDateFormatted = maxDate.toISOString().split('T')[0];
        dateInput.setAttribute('max', maxDateFormatted);
        
        console.log('Date input set to today:', todayFormatted);
        console.log('Min date:', todayFormatted);
        console.log('Max date:', maxDateFormatted);
    }
    
    // Update cuaca saat ini
    updateCurrentWeather();
    
    // Event listener untuk tombol prediksi
    const predictBtn = document.getElementById('predictBtn') || document.querySelector('button[onclick="predictWeather()"]');
    if (predictBtn) {
        // Tambahkan event listener sebagai backup
        predictBtn.addEventListener('click', predictWeather);
    }
    
    // Tambahkan format tanggal di greeting
    updateGreetingWithDate();
});

// Fungsi untuk menambahkan tanggal di greeting
function updateGreetingWithDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    
    const formattedDate = today.toLocaleDateString('id-ID', options);
    
    // Coba tambahkan tanggal ke greeting jika ada
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        // Simpan username dari greeting yang ada
        const currentGreeting = greetingElement.textContent;
        
        // Tambahkan tanggal di baris baru
        greetingElement.innerHTML = `${currentGreeting}<br><span style="font-size: 1.2rem; opacity: 0.9;">${formattedDate}</span>`;
    }
    
    // Update juga placeholder di input tanggal
    updateDateInputPlaceholder();
}

// Fungsi untuk update placeholder input tanggal
function updateDateInputPlaceholder() {
    const dateInput = document.getElementById('searchDate');
    if (dateInput) {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        
        // Update tooltip
        dateInput.title = `Tanggal hari ini: ${formatDate(todayFormatted)}`;
        
        // Update placeholder attribute
        dateInput.setAttribute('placeholder', 'Pilih tanggal prediksi');
    }
}

function updateCurrentWeather() {
    console.log('Updating current weather...');
    try {
        const weatherConditions = ['Cerah', 'Berawan', 'Hujan Ringan', 'Kabut'];
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const temperature = Math.floor(Math.random() * 15) + 15;
        
        const weatherText = document.getElementById('weather-text');
        if (weatherText) {
            weatherText.textContent = `${randomCondition} | ${temperature}°C`;
            console.log('Weather text updated:', weatherText.textContent);
        }
        
        // Update background
        const body = document.getElementById('weather-body');
        if (body) {
            body.className = getWeatherClass(randomCondition);
        }
    } catch (error) {
        console.error('Error updating weather:', error);
    }
}

function getWeatherClass(condition) {
    const conditionMap = {
        'Cerah': 'cerah',
        'Sunny': 'cerah',
        'Berawan': 'default',
        'Cloudy': 'default',
        'Hujan Ringan': 'gerimis',
        'Hujan': 'hujan',
        'Rain': 'hujan',
        'Kabut': 'kabut',
        'Fog': 'kabut',
        'Salju': 'salju',
        'Snow': 'salju'
    };
    
    return conditionMap[condition] || 'default';
}

function predictWeather() {
    console.log('Predict weather function called');
    
    const dateInput = document.getElementById('searchDate');
    const resultDiv = document.getElementById('prediction-result');
    
    if (!dateInput || !resultDiv) {
        console.error('Required elements not found');
        return;
    }
    
    const date = dateInput.value;
    console.log('Selected date:', date);
    
    if (!date) {
        showError('Silakan pilih tanggal terlebih dahulu');
        return;
    }
    
    // Validasi: jika memilih hari ini, berikan pesan khusus
    const today = new Date().toISOString().split('T')[0];
    if (date === today) {
        console.log('User selected today\'s date');
        // Anda bisa menambahkan pesan khusus di sini
    }
    
    // Show loading
    resultDiv.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Memprediksi cuaca untuk ${formatDate(date)}...
        </div>
    `;
    resultDiv.className = 'has-content';
    resultDiv.style.display = 'block';
    
    console.log('Showing loading...');
    
    // Simulasi prediksi dengan delay
    setTimeout(() => {
        try {
            console.log('Generating prediction...');
            const prediction = generatePrediction(date);
            
            resultDiv.innerHTML = `
                <h3 class="prediction-title">
                    <i class="fas fa-chart-line"></i> Prediksi Cuaca ${formatDate(date)}
                </h3>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Suhu</span>
                        <span class="result-value">${prediction.temperature}°C</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Kelembaban</span>
                        <span class="result-value">${prediction.humidity}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Kecepatan Angin</span>
                        <span class="result-value">${prediction.windSpeed} km/jam</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Tekanan</span>
                        <span class="result-value">${prediction.pressure} hPa</span>
                    </div>
                </div>
                <div class="prediction-summary">
                    <i class="fas fa-info-circle"></i> ${prediction.summary}
                </div>
            `;
            
            console.log('Prediction result displayed');
            
            // Update background berdasarkan prediksi
            const body = document.getElementById('weather-body');
            if (body) {
                body.className = getWeatherClass(prediction.condition);
            }
            
            // Scroll ke hasil prediksi
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Error generating prediction:', error);
            showError('Gagal memprediksi cuaca. Silakan coba lagi.');
        }
    }, 1500);
}

function generatePrediction(date) {
    const conditions = [
        { name: 'Cerah', class: 'cerah' },
        { name: 'Berawan', class: 'default' },
        { name: 'Hujan Ringan', class: 'gerimis' },
        { name: 'Hujan', class: 'hujan' },
        { name: 'Kabut', class: 'kabut' }
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Berikan nilai prediksi yang lebih realistis berdasarkan musim
    const selectedDate = new Date(date);
    const month = selectedDate.getMonth() + 1; // January = 1
    
    let baseTemp = 25;
    // Sesuaikan suhu berdasarkan bulan (untuk Seattle)
    if (month >= 12 || month <= 2) baseTemp = 8;  // Winter
    else if (month >= 3 && month <= 5) baseTemp = 15;  // Spring
    else if (month >= 6 && month <= 8) baseTemp = 22;  // Summer
    else baseTemp = 18;  // Fall
    
    return {
        temperature: Math.floor(Math.random() * 8) + baseTemp,
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 30) + 5,
        pressure: Math.floor(Math.random() * 30) + 1000,
        condition: randomCondition.name,
        summary: `Prediksi cuaca ${randomCondition.name.toLowerCase()} dengan suhu sedang di Seattle.`
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

function showError(message) {
    const resultDiv = document.getElementById('prediction-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> ${message}
            </div>
        `;
        resultDiv.className = 'has-content';
        resultDiv.style.display = 'block';
    }
    console.error('Error:', message);
}

// Tambahan: Fungsi untuk update jam real-time (opsional)
function updateRealTimeClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Cari atau buat elemen untuk jam
    let clockElement = document.getElementById('real-time-clock');
    if (!clockElement) {
        clockElement = document.createElement('div');
        clockElement.id = 'real-time-clock';
        clockElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0,0,0,0.5);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 999;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(clockElement);
    }
    
    clockElement.textContent = `🕐 ${timeString}`;
}

// Jalankan update jam setiap detik (opsional)
setInterval(updateRealTimeClock, 1000);
updateRealTimeClock(); // Panggil sekali di awal
