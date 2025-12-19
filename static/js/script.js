document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully');
    
    // Set tanggal default ke besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    const dateInput = document.getElementById('searchDate');
    if (dateInput) {
        dateInput.value = tomorrowFormatted;
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        console.log('Date input set to:', tomorrowFormatted);
    }
    
    // Update cuaca saat ini
    updateCurrentWeather();
    
    // Event listener untuk tombol prediksi
    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
        // Tambahkan event listener sebagai backup
        predictBtn.addEventListener('click', predictWeather);
    }
});

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
    
    // Show loading
    resultDiv.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Memprediksi cuaca...
        </div>
    `;
    resultDiv.className = 'has-content';
    resultDiv.style.display = 'block';
    
    console.log('Showing loading...');
    
    // Simulasi prediksi
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
            
            // Update background
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
    
    return {
        temperature: Math.floor(Math.random() * 15) + 15,
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 30) + 5,
        pressure: Math.floor(Math.random() * 30) + 1000,
        condition: randomCondition.name,
        summary: `Prediksi cuaca ${randomCondition.name.toLowerCase()} dengan suhu sedang. Cocok untuk aktivitas luar ruangan.`
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
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
