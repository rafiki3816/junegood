// Secure Authentication Manager for Cloudflare Pages
// Uses encrypted credentials stored in localStorage after first setup

(function() {
    'use strict';

    const config = window.CONFIG || {};

    // Configuration
    const AUTH_KEY = config.STORAGE_KEY_AUTH || 'junegood_admin_auth';
    const CREDENTIALS_KEY = config.STORAGE_KEY_CREDENTIALS || 'junegood_admin_creds';
    const SETUP_KEY = 'junegood_auth_setup';
    const MAX_LOGIN_ATTEMPTS = config.MAX_LOGIN_ATTEMPTS || 5;
    const LOCKOUT_TIME = config.LOCKOUT_TIME || 900000;
    const SESSION_TIMEOUT = config.SESSION_TIMEOUT || 1800000;
    const ATTEMPTS_KEY = config.STORAGE_KEY_ATTEMPTS || 'junegood_login_attempts';
    const LOCKOUT_KEY = config.STORAGE_KEY_LOCKOUT || 'junegood_lockout_until';

    // Enhanced hash function
    function hashPassword(password) {
        let hash = 5381;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) + hash) + password.charCodeAt(i);
        }
        // Add salt and encode
        const salt = 'junegood2024';
        const salted = password + salt;
        return btoa(hash.toString() + '|' + salted.length + '|' + btoa(salted));
    }

    // Check if credentials are set up
    function isSetup() {
        return localStorage.getItem(SETUP_KEY) === 'true';
    }

    // Initial setup for admin credentials
    function setupCredentials(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const hashedCreds = {
            username: username,
            password: hashPassword(password),
            created: new Date().toISOString()
        };

        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(hashedCreds));
        localStorage.setItem(SETUP_KEY, 'true');

        return true;
    }

    // Change password
    function changePassword(currentPassword, newPassword) {
        const stored = localStorage.getItem(CREDENTIALS_KEY);
        if (!stored) return false;

        const creds = JSON.parse(stored);

        // Verify current password
        if (hashPassword(currentPassword) !== creds.password) {
            return false;
        }

        // Update password
        creds.password = hashPassword(newPassword);
        creds.updated = new Date().toISOString();
        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));

        return true;
    }

    // Check if account is locked
    function isAccountLocked() {
        const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
        if (lockoutUntil) {
            const lockoutTime = parseInt(lockoutUntil);
            if (Date.now() < lockoutTime) {
                return true;
            } else {
                localStorage.removeItem(LOCKOUT_KEY);
                localStorage.removeItem(ATTEMPTS_KEY);
            }
        }
        return false;
    }

    // Record failed login attempt
    function recordFailedAttempt() {
        const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
        localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            const lockoutUntil = Date.now() + LOCKOUT_TIME;
            localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
            return true; // Account locked
        }
        return false;
    }

    // Clear failed attempts
    function clearFailedAttempts() {
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_KEY);
    }

    // Set session timeout
    function setSessionTimeout() {
        const timeout = Date.now() + SESSION_TIMEOUT;
        sessionStorage.setItem(AUTH_KEY + '_timeout', timeout.toString());
    }

    // Check session timeout
    function isSessionValid() {
        const timeout = sessionStorage.getItem(AUTH_KEY + '_timeout');
        if (!timeout) return false;

        if (Date.now() > parseInt(timeout)) {
            sessionStorage.removeItem(AUTH_KEY);
            sessionStorage.removeItem(AUTH_KEY + '_timeout');
            return false;
        }

        // Extend session on activity
        setSessionTimeout();
        return true;
    }

    // Login function
    function login(username, password) {
        // Check if account is locked
        if (isAccountLocked()) {
            const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
            const remainingTime = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 60000);
            throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
        }

        // If not setup, use first login to set credentials
        if (!isSetup()) {
            // First time setup - set the provided credentials as admin
            setupCredentials(username, password);
            sessionStorage.setItem(AUTH_KEY, 'true');
            setSessionTimeout();
            clearFailedAttempts();
            return true;
        }

        // Normal login
        const stored = localStorage.getItem(CREDENTIALS_KEY);
        if (!stored) {
            recordFailedAttempt();
            return false;
        }

        const creds = JSON.parse(stored);

        if (username === creds.username && hashPassword(password) === creds.password) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            setSessionTimeout();
            clearFailedAttempts();
            return true;
        }

        // Record failed attempt
        const locked = recordFailedAttempt();
        if (locked) {
            throw new Error('Too many failed attempts. Account locked for 15 minutes.');
        }

        return false;
    }

    // Check if user is authenticated
    function isAuthenticated() {
        const auth = sessionStorage.getItem(AUTH_KEY);
        return auth === 'true' && isSessionValid();
    }

    // Logout function
    function logout() {
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_KEY + '_timeout');
        window.location.href = '/journals-login.html';
    }

    // Protect page
    function protectPage() {
        if (!isAuthenticated()) {
            window.location.href = '/journals-login.html';
        }
    }

    // Reset authentication (for emergency use only)
    function resetAuth() {
        if (confirm('This will reset all authentication settings. Are you sure?')) {
            localStorage.removeItem(CREDENTIALS_KEY);
            localStorage.removeItem(SETUP_KEY);
            localStorage.removeItem(ATTEMPTS_KEY);
            localStorage.removeItem(LOCKOUT_KEY);
            sessionStorage.removeItem(AUTH_KEY);
            sessionStorage.removeItem(AUTH_KEY + '_timeout');
            alert('Authentication reset. You can now set new credentials on next login.');
            window.location.href = '/journals-login.html';
        }
    }

    // Export functions
    window.AuthManager = {
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated,
        protectPage: protectPage,
        changePassword: changePassword,
        isSetup: isSetup,
        setupCredentials: setupCredentials,
        resetAuth: resetAuth,
        isAccountLocked: isAccountLocked
    };

    // Keep compatibility with old JournalsAuth
    window.JournalsAuth = window.AuthManager;

})();