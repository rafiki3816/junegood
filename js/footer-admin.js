// Simple footer admin access
document.addEventListener('DOMContentLoaded', function() {
    // Add footer to pages that don't have it
    function addFooter() {
        // Check if footer already exists
        if (document.querySelector('footer')) return;

        const footer = document.createElement('footer');
        footer.style.cssText = `
            text-align: center;
            padding: 30px 20px;
            margin-top: 50px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        `;

        footer.innerHTML = `
            <p>&copy; 2025 Dongjune Kim</p>
        `;

        document.body.appendChild(footer);
    }

    // Triple-click on copyright text for admin access
    function setupAdminTrigger() {
        const footer = document.querySelector('footer');
        if (!footer) {
            addFooter();
        }

        const copyright = document.querySelector('footer p');
        if (!copyright) return;

        let clickCount = 0;
        let clickTimer = null;

        copyright.style.cursor = 'default';
        copyright.style.userSelect = 'none';

        copyright.addEventListener('click', function(e) {
            e.preventDefault();
            clickCount++;
            clearTimeout(clickTimer);

            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);

            if (clickCount === 3) {
                // Triple-clicked - redirect to admin login
                window.location.href = '/journals-login.html';
                clickCount = 0;
            }
        });
    }

    // Initialize
    addFooter();
    setupAdminTrigger();
});