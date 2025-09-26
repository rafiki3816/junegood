// Enhanced security authentication system for journals admin
// Note: This is still client-side. For production, implement server-side authentication

(function() {
    'use strict';

    // Configuration
    const AUTH_KEY = 'junegood_admin_auth';
    const CREDENTIALS_KEY = 'junegood_admin_creds';
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const ATTEMPTS_KEY = 'junegood_login_attempts';
    const LOCKOUT_KEY = 'junegood_lockout_until';

    // Simple hash function (replace with bcrypt in production)
    function hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return btoa(hash.toString() + password.length);
    }

    // Default admin credentials (should be changed immediately)
    const DEFAULT_CREDENTIALS = {
        username: 'admin',
        password: hashPassword('junegood2024!')
    };

    // Initialize credentials if not exists
    function initializeCredentials() {
        const stored = localStorage.getItem(CREDENTIALS_KEY);
        if (!stored) {
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
        }
    }

    // Check if account is locked
    function isAccountLocked() {
        const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
        if (lockoutUntil) {
            const lockoutTime = parseInt(lockoutUntil);
            if (Date.now() < lockoutTime) {
                return true;
            } else {
                // Lockout expired, clear it
                localStorage.removeItem(LOCKOUT_KEY);
                localStorage.removeItem(ATTEMPTS_KEY);
            }
        }
        return false;
    }

    // Record failed login attempt
    function recordFailedAttempt() {
        let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
        attempts++;
        localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            // Lock the account
            const lockoutUntil = Date.now() + LOCKOUT_TIME;
            localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
            return { locked: true, attempts: attempts };
        }

        return { locked: false, attempts: attempts, remaining: MAX_LOGIN_ATTEMPTS - attempts };
    }

    // Clear failed attempts on successful login
    function clearFailedAttempts() {
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_KEY);
    }

    // Sanitize input to prevent XSS
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Validate username format
    function validateUsername(username) {
        // Allow only alphanumeric and underscore, 3-20 characters
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    // Validate password strength
    function validatePasswordStrength(password) {
        // At least 8 characters, one uppercase, one lowercase, one number, one special character
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return strongRegex.test(password);
    }

    // Check if user is authenticated with session timeout
    function isAuthenticated() {
        const auth = sessionStorage.getItem(AUTH_KEY);
        if (auth) {
            const authData = JSON.parse(auth);
            if (Date.now() - authData.timestamp > SESSION_TIMEOUT) {
                // Session expired
                logout();
                return false;
            }
            // Update timestamp on activity
            authData.timestamp = Date.now();
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
            return true;
        }
        return false;
    }

    // Login function with enhanced security
    function login(username, password) {
        // Check if account is locked
        if (isAccountLocked()) {
            return { success: false, error: 'Account is locked due to too many failed attempts. Please try again later.' };
        }

        // Sanitize inputs
        username = sanitizeInput(username);

        // Validate username format
        if (!validateUsername(username)) {
            return { success: false, error: 'Invalid username format' };
        }

        const stored = localStorage.getItem(CREDENTIALS_KEY);
        const creds = stored ? JSON.parse(stored) : null;

        if (!creds) {
            initializeCredentials();
            return login(username, password);
        }

        // Check credentials with hashed password
        if (username === creds.username && hashPassword(password) === creds.password) {
            const authData = {
                authenticated: true,
                timestamp: Date.now(),
                username: username
            };
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
            clearFailedAttempts();
            return { success: true };
        }

        // Record failed attempt
        const attemptResult = recordFailedAttempt();
        if (attemptResult.locked) {
            return { success: false, error: 'Too many failed attempts. Account has been locked for 15 minutes.' };
        } else {
            return { success: false, error: `Invalid credentials. ${attemptResult.remaining} attempts remaining.` };
        }
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

    // Change password function with validation
    function changePassword(oldPassword, newPassword) {
        if (!validatePasswordStrength(newPassword)) {
            return { success: false, error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' };
        }

        const stored = localStorage.getItem(CREDENTIALS_KEY);
        const creds = stored ? JSON.parse(stored) : null;

        if (!creds) return { success: false, error: 'No credentials found' };

        if (hashPassword(oldPassword) === creds.password) {
            creds.password = hashPassword(newPassword);
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
            return { success: true };
        }
        return { success: false, error: 'Current password is incorrect' };
    }

    // Handle login form with enhanced security
    if (document.getElementById('loginForm')) {
        // Initialize credentials on login page
        initializeCredentials();

        // Add CSRF token (in production, this should come from the server)
        const csrfToken = Math.random().toString(36).substring(2);
        sessionStorage.setItem('csrf_token', csrfToken);

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMessage');

            const result = login(username, password);

            if (result.success) {
                window.location.href = 'journals-admin.html';
            } else {
                errorMsg.textContent = result.error;
                errorMsg.style.display = 'block';
                document.getElementById('password').value = '';
            }
        });

        // Auto-logout on inactivity
        let inactivityTimer;
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(logout, SESSION_TIMEOUT);
        }

        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
    }

    // Export functions for use in other scripts
    window.JournalsAuth = {
        isAuthenticated: isAuthenticated,
        logout: logout,
        protectPage: protectPage,
        changePassword: changePassword,
        validatePasswordStrength: validatePasswordStrength
    };
})();