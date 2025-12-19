/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    transition: background-image 0.5s ease-in-out;
}

body {
    min-height: 100vh;
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}

/* Theme Backgrounds */
.default {
    background-image: url('../images/home.png');
}

.cerah {
    background-image: url('../images/sun.jpg');
}

.hujan {
    background-image: url('../images/rain.jpg');
}

.gerimis {
    background-image: url('../images/drizzle2.png');
}

.kabut {
    background-image: url('../images/Fog.jpg');
}

.salju {
    background-image: url('../images/Snow.jpg');
}

/* ======================================
   NAVIGATION - PERBAIKAN BESAR
   ====================================== */
#nav-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0 20px;
}

.nav-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    max-width: 1200px;
    margin: 0 auto;
    gap: 20px;
}

/* PERUBAHAN: Nav brand tanpa background atau border */
.nav-brand {
    flex: 1;
    display: flex;
    justify-content: center;
}

.nav-brand h1 {
    color: white;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    background: none;
    padding: 0;
    border: none;
}

.nav-brand i {
    font-size: 1.5rem;
    color: #4dabf7;
}

/* Hamburger Menu */
.hamburger-label {
    display: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    transition: all 0.3s ease;
}

.hamburger-label:hover {
    transform: scale(1.1);
}

#hamburger {
    display: none;
}

/* Navigation Links */
nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 10px 20px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
}

.logout-btn i {
    font-size: 1.2em;
}

/* ======================================
   HERO SECTION
   ====================================== */
#hero-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px 20px 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.text {
    background: rgba(255, 255, 255, 0);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    text-align: center;
    color: #fff;
    width: 90%;
    max-width: 600px;
    margin: 0 auto;
}

#greeting {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: white;
    font-weight: 700;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

#weather-text {
    font-size: 2rem;
    margin-bottom: 30px;
    color: white;
    min-height: 60px;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* ======================================
   SEARCH CONTAINER - PERBAIKAN UTAMA
   ====================================== */
#search-container {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

/* Input wrapper untuk styling yang konsisten */
.input-wrapper {
    position: relative;
    width: 100%;
}

/* Input tanggal dengan styling mirip tombol */
#searchDate {
    width: 100%;
    padding: 16px 50px 16px 20px;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    appearance: none;
    -webkit-appearance: none;
    outline: none;
}

/* Placeholder styling */
#searchDate::before {
    content: "Pilih Tanggal";
    color: #666;
}

#searchDate:valid::before {
    content: "";
}

#searchDate:focus {
    background: white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

/* Icon kalender */
.input-wrapper i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #4dabf7;
    font-size: 1.2rem;
    pointer-events: none;
    z-index: 2;
}

/* Tombol prediksi cuaca */
button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #4dabf7, #2196f3);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

button:hover {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

button:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

button i {
    font-size: 1.2rem;
}

/* ======================================
   PREDICTION RESULT
   ====================================== */
#prediction-result {
    margin-top: 25px;
    padding: 25px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: none;
    animation: fadeIn 0.5s ease-out;
}

#prediction-result.has-content {
    display: block;
}

.prediction-title {
    font-size: 1.4rem;
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.95);
    text-align: center;
    font-weight: 700;
}

.result-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.result-item {
    background: rgba(255, 255, 255, 0.15);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    transition: all 0.3s ease;
}

.result-item:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.2);
}

.result-label {
    font-size: 0.9em;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.result-value {
    font-weight: bold;
    font-size: 1.4em;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.prediction-summary {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    font-style: italic;
    color: rgba(255, 255, 255, 0.95);
    margin-top: 15px;
    font-size: 1.1em;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ======================================
   RESPONSIVE DESIGN - TABLET (768px ke bawah)
   ====================================== */
@media (max-width: 768px) {
    .nav-flex {
        padding: 12px 0;
    }
    
    .nav-brand h1 {
        font-size: 1.3rem;
    }
    
    .nav-brand i {
        font-size: 1.3rem;
    }
    
    #greeting {
        font-size: 2rem;
    }
    
    #weather-text {
        font-size: 1.6rem;
        min-height: 50px;
    }
    
    .text {
        padding: 30px 25px;
    }
    
    #searchDate {
        padding: 14px 45px 14px 18px;
        font-size: 1rem;
    }
    
    .input-wrapper i {
        right: 15px;
        font-size: 1.1rem;
    }
    
    button {
        padding: 14px;
        font-size: 1rem;
    }
    
    #prediction-result {
        padding: 20px;
    }
    
    .prediction-title {
        font-size: 1.3rem;
    }
}

/* ======================================
   RESPONSIVE DESIGN - MOBILE (600px ke bawah)
   ====================================== */
@media (max-width: 600px) {
    /* Navigation Mobile */
    .hamburger-label {
        display: block;
        order: -1;
        font-size: 1.4rem;
    }
    
    .nav-flex {
        flex-wrap: wrap;
        padding: 10px 0;
        gap: 15px;
    }
    
    .nav-brand {
        order: 2;
        width: calc(100% - 60px);
        justify-content: flex-start;
    }
    
    .nav-brand h1 {
        font-size: 1.1rem;
        justify-content: flex-start;
    }
    
    nav {
        display: none;
        width: 100%;
        order: 3;
        margin-top: 10px;
    }
    
    #hamburger:checked ~ nav {
        display: block;
    }
    
    nav ul {
        justify-content: center;
    }
    
    .logout-btn {
        width: 100%;
        justify-content: center;
        padding: 10px;
    }
    
    /* Hero Section */
    #hero-container {
        padding: 80px 15px 30px;
    }
    
    .text {
        width: 95%;
        padding: 25px 20px;
        margin-top: 10px;
    }
    
    #greeting {
        font-size: 1.8rem;
        margin-bottom: 15px;
    }
    
    #weather-text {
        font-size: 1.4rem;
        margin-bottom: 25px;
        min-height: 40px;
    }
    
    /* Search Container */
    #search-container {
        margin-top: 25px;
        gap: 15px;
    }
    
    #searchDate {
        padding: 14px 40px 14px 15px;
        font-size: 0.95rem;
    }
    
    .input-wrapper i {
        right: 12px;
    }
    
    button {
        padding: 14px;
        font-size: 1rem;
    }
    
    /* Prediction Result Mobile */
    .result-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .result-item {
        padding: 12px;
    }
    
    #prediction-result {
        padding: 18px;
    }
    
    .prediction-title {
        font-size: 1.2rem;
    }
}

/* ======================================
   RESPONSIVE DESIGN - SMALL MOBILE (400px ke bawah)
   ====================================== */
@media (max-width: 400px) {
    .nav-brand h1 {
        font-size: 1rem;
    }
    
    .nav-brand i {
        font-size: 1rem;
    }
    
    .hamburger-label {
        font-size: 1.2rem;
    }
    
    #greeting {
        font-size: 1.6rem;
    }
    
    #weather-text {
        font-size: 1.2rem;
        min-height: 35px;
    }
    
    .text {
        padding: 20px 15px;
    }
    
    #searchDate {
        padding: 12px 35px 12px 12px;
        font-size: 0.9rem;
    }
    
    button {
        padding: 12px;
        font-size: 0.95rem;
    }
    
    .logout-btn {
        font-size: 0.9rem;
        padding: 8px 12px;
    }
    
    #prediction-result {
        padding: 15px;
    }
    
    .prediction-title {
        font-size: 1.1rem;
    }
}

/* ======================================
   RESPONSIVE DESIGN - LANDSCAPE MODE
   ====================================== */
@media (max-height: 500px) and (orientation: landscape) {
    #hero-container {
        padding-top: 70px;
        min-height: auto;
    }
    
    .text {
        margin: 30px auto;
        padding: 20px;
    }
    
    #greeting {
        font-size: 1.6rem;
        margin-bottom: 10px;
    }
    
    #weather-text {
        font-size: 1.3rem;
        margin-bottom: 20px;
        min-height: 30px;
    }
    
    #search-container {
        margin-top: 20px;
        gap: 15px;
    }
    
    #searchDate, button {
        padding: 12px;
    }
}

/* ======================================
   SPECIAL FIXES FOR DATE INPUT
   ====================================== */
/* Hide default calendar picker icon and use our custom one */
#searchDate::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
}

/* For Firefox */
#searchDate::-moz-focus-inner {
    border: 0;
}

/* For IE */
#searchDate::-ms-expand {
    display: none;
}

/* Style for invalid/empty date */
#searchDate:invalid {
    color: #666;
}

#searchDate:valid {
    color: #333;
}
