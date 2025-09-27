// Simple authentication system for journals admin
// Note: This is client-side only and should be replaced with server-side auth in production

(function() {
    'use strict';

    // Load configuration
    const config = window.CONFIG || {};

    // Configuration from environment variables or defaults
    const AUTH_KEY = config.STORAGE_KEY_AUTH || 'junegood_admin_auth';
    const CREDENTIALS_KEY = config.STORAGE_KEY_CREDENTIALS || 'junegood_admin_creds';

    // Admin credentials from environment variables
    const DEFAULT_CREDENTIALS = {
        username: config.ADMIN_USERNAME || 'admin',
        password: config.ADMIN_PASSWORD || 'junegood2024!'
    };

    // Initialize credentials if not exists
    function initializeCredentials() {
        const stored = localStorage.getItem(CREDENTIALS_KEY);
        if (!stored) {
            // Store hashed password instead of plain text
            const hashedCreds = {
                username: DEFAULT_CREDENTIALS.username,
                password: btoa(DEFAULT_CREDENTIALS.password) // Simple encoding (use proper hashing in production)
            };
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(hashedCreds));
        }
    }

    // Check if user is authenticated
    function isAuthenticated() {
        const auth = sessionStorage.getItem(AUTH_KEY);
        return auth === 'true';
    }

    // Login function
    function login(username, password) {
        const stored = localStorage.getItem(CREDENTIALS_KEY);
        const creds = stored ? JSON.parse(stored) : null;

        if (!creds) {
            initializeCredentials();
            return login(username, password);
        }

        // Check credentials
        if (username === creds.username && btoa(password) === creds.password) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            return true;
        }
        return false;
    }

    // Logout function
    function logout() {
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = 'journals-login.html';
    }

    // Protect admin pages
    function protectPage() {
        if (!isAuthenticated()) {
            window.location.href = 'journals-login.html';
        }
    }

    // Change password function
    function changePassword(oldPassword, newPassword) {
        const stored = localStorage.getItem(CREDENTIALS_KEY);
        const creds = stored ? JSON.parse(stored) : null;

        if (!creds) return false;

        if (btoa(oldPassword) === creds.password) {
            creds.password = btoa(newPassword);
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
            return true;
        }
        return false;
    }

    // Handle login form
    if (document.getElementById('loginForm')) {
        // Initialize credentials on login page
        initializeCredentials();

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMessage');

            if (login(username, password)) {
                window.location.href = 'journals-admin.html';
            } else {
                errorMsg.style.display = 'block';
                document.getElementById('password').value = '';
            }
        });
    }

    // Export functions for use in other scripts
    window.JournalsAuth = {
        isAuthenticated: isAuthenticated,
        logout: logout,
        protectPage: protectPage,
        changePassword: changePassword
    };
})();