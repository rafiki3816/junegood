// Mobile menu toggle - Vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navigation = document.getElementById('navigation');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navigation.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (menuToggle && navigation) {
            if (!menuToggle.contains(event.target) && !navigation.contains(event.target)) {
                menuToggle.classList.remove('active');
                navigation.classList.remove('active');
            }
        }
    });

    // Close menu when clicking on a link (mobile)
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 767) {
                menuToggle.classList.remove('active');
                navigation.classList.remove('active');
            }
        });
    });

    // Ensure background image is loaded
    const wrap = document.getElementById('wrap');
    if (wrap) {
        // Check if background image is already set via CSS
        const computedStyle = window.getComputedStyle(wrap);
        const currentBg = computedStyle.backgroundImage;

        // If no background or none, force load
        if (!currentBg || currentBg === 'none') {
            const bgImage = new Image();
            bgImage.src = 'images/bg.png';
            bgImage.onload = function() {
                wrap.style.backgroundImage = 'url(' + bgImage.src + ')';
                wrap.style.backgroundSize = 'cover';
                wrap.style.backgroundPosition = 'center center';
                wrap.style.backgroundRepeat = 'no-repeat';
                wrap.style.backgroundAttachment = 'fixed';
            };
            bgImage.onerror = function() {
                console.error('Failed to load background image: images/bg.png');
            };
        }
    }
});