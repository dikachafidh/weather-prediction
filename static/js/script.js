document.addEventListener('DOMContentLoaded', function() {
    // Set tanggal default ke besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    document.getElementById('searchDate').value = tomorrowFormatted;
    
    // Update greeting berdasarkan waktu
    updateGreeting();
    
    // Update cuaca saat ini
    updateCurrentWeather();
});

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingElement = document.getElementById('greeting');
    let greeting = "Hello, ";
    
    if (hour < 12) greeting += "Good Morning";
    else if (hour < 15) greeting += "Good Afternoon";
    else if (hour < 19) greeting += "Good Evening";
    else greeting += "Good Night";
    
    // Greeting akan diupdate oleh template dari Flask
}

function updateCurrentWeather() {
    // Simulasi data cuaca saat ini
    const weatherConditions = ['Sunny', 'Cloudy', 'Light Rain', 'Foggy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const temperature = Math.floor(Math.random() * 15) + 15; // 15-30°C
    
    document.getElementById('weather-text').textContent = 
        `${randomCondition} | ${temperature}°C`;
    
    // Update class body berdasarkan kondisi cuaca
    const body = document.getElementById('weather-body');
    body.className = getWeatherClass(randomCondition);
}

function getWeatherClass(condition) {
    const conditionMap = {
        'Sunny': 'cerah',
        'Cloudy': 'default',
        'Light Rain': 'gerimis',
        'Rain': 'hujan',
        'Foggy': 'kabut',
        'Snow': 'salju'
    };
    
    return conditionMap[condition] || 'default';
}

async function predictWeather() {
    const dateInput = document.getElementById('searchDate');
    const date = dateInput.value;
    const resultDiv = document.getElementById('prediction-result');
    
    if (!date) {
        showError('Please select a date first');
        return;
    }
    
    // Show loading
    resultDiv.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Predicting weather...
        </div>
    `;
    resultDiv.className = 'has-content';
    
    try {
        // Simulasi API call
        setTimeout(() => {
            // Data prediksi simulasi
            const prediction = generatePrediction(date);
            
            resultDiv.innerHTML = `
                <h3 class="prediction-title">
                    <i class="fas fa-chart-line"></i> Weather Prediction for ${formatDate(date)}
                </h3>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Temperature</span>
                        <span class="result-value">${prediction.temperature}°C</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Humidity</span>
                        <span class="result-value">${prediction.humidity}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Wind Speed</span>
                        <span class="result-value">${prediction.windSpeed} km/h</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Pressure</span>
                        <span class="result-value">${prediction.pressure} hPa</span>
                    </div>
                </div>
                <div class="prediction-summary">
                    <i class="fas fa-info-circle"></i> ${prediction.summary}
                </div>
            `;
            
            // Update background berdasarkan prediksi
            const body = document.getElementById('weather-body');
            body.className = getWeatherClass(prediction.condition);
            
        }, 1500);
        
    } catch (error) {
        showError('Failed to predict weather. Please try again.');
    }
}

function generatePrediction(date) {
    const conditions = [
        { name: 'Sunny', class: 'cerah' },
        { name: 'Cloudy', class: 'default' },
        { name: 'Light Rain', class: 'gerimis' },
        { name: 'Rain', class: 'hujan' },
        { name: 'Foggy', class: 'kabut' }
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
        temperature: Math.floor(Math.random() * 15) + 15,
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 30) + 5,
        pressure: Math.floor(Math.random() * 30) + 1000,
        condition: randomCondition.name,
        summary: `Predicted ${randomCondition.name.toLowerCase()} weather with moderate temperature. Suitable for outdoor activities.`
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showError(message) {
    const resultDiv = document.getElementById('prediction-result');
    resultDiv.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>
    `;
    resultDiv.className = 'has-content';
}
