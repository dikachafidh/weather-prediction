// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle menu ketika hamburger diklik
        hamburger.addEventListener('change', function() {
            if (this.checked) {
                navMenu.style.display = 'block';
                // Tambahkan animasi
                navMenu.style.animation = 'slideDown 0.3s ease-out';
            } else {
                navMenu.style.display = 'none';
            }
        });
        
        // Tutup menu jika klik di luar
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-flex') && hamburger.checked) {
                hamburger.checked = false;
                navMenu.style.display = 'none';
            }
        });
        
        // Untuk touch devices
        document.addEventListener('touchstart', function(event) {
            if (!event.target.closest('.nav-flex') && hamburger.checked) {
                hamburger.checked = false;
                navMenu.style.display = 'none';
            }
        });
    }
});
