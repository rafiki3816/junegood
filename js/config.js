// Configuration loader for environment variables
// This file loads configuration from .env file or uses defaults

(function() {
    'use strict';

    // Configuration object
    window.CONFIG = {
        // Default values (will be overridden by .env if available)
        ADMIN_USERNAME: 'admin',
        // Password must be set during initial setup for security
        SESSION_TIMEOUT: 1800000,  // 30 minutes
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_TIME: 900000,  // 15 minutes
        SITE_NAME: 'junegood',
        SITE_AUTHOR: 'Dongjune Kim',
        SITE_URL: 'https://junegood.pages.dev',
        STORAGE_KEY_JOURNALS: 'junegood_journals',
        STORAGE_KEY_COMMENTS: 'junegood_comments',
        STORAGE_KEY_AUTH: 'junegood_admin_auth',
        STORAGE_KEY_CREDENTIALS: 'junegood_admin_creds',
        STORAGE_KEY_ATTEMPTS: 'junegood_login_attempts',
        STORAGE_KEY_LOCKOUT: 'junegood_lockout_until',
        DEV_PORT: 8000,
        DEBUG_MODE: false,
        GITHUB_REPO: 'https://github.com/rafiki3816/junegood.git',
        GITHUB_ISSUES: 'https://github.com/rafiki3816/junegood/issues',
        DATA_JOURNALS_PATH: '/data/journals.json',
        PRIMARY_COLOR: '#0066cc',
        SECONDARY_COLOR: '#6c757d',
        SUCCESS_COLOR: '#28a745',
        DANGER_COLOR: '#dc3545',
        BREAKPOINT_MOBILE: 768,
        BREAKPOINT_TABLET: 1024,
        BREAKPOINT_DESKTOP: 1440
    };

    // Function to load .env file
    async function loadEnvFile() {
        try {
            const response = await fetch('/.env');
            if (response.ok) {
                const text = await response.text();
                parseEnvFile(text);
            }
        } catch (error) {
            // .env file not found or not accessible, use defaults
            if (window.CONFIG.DEBUG_MODE) {
                console.log('Using default configuration (no .env file found)');
            }
        }
    }

    // Function to parse .env file content
    function parseEnvFile(content) {
        const lines = content.split('\n');
        lines.forEach(line => {
            // Skip comments and empty lines
            if (!line || line.startsWith('#')) return;

            // Parse key=value pairs
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                const trimmedKey = key.trim();

                // Convert string values to appropriate types
                let parsedValue = value;

                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    parsedValue = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    parsedValue = value.slice(1, -1);
                }

                // Convert to boolean if applicable
                if (parsedValue === 'true') {
                    parsedValue = true;
                } else if (parsedValue === 'false') {
                    parsedValue = false;
                }
                // Convert to number if applicable
                else if (!isNaN(parsedValue) && parsedValue !== '') {
                    parsedValue = Number(parsedValue);
                }

                window.CONFIG[trimmedKey] = parsedValue;
            }
        });
    }

    // Load configuration on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadEnvFile);
    } else {
        loadEnvFile();
    }

    // Helper function to get config value
    window.getConfig = function(key, defaultValue) {
        return window.CONFIG[key] !== undefined ? window.CONFIG[key] : defaultValue;
    };

    // Helper function to set config value (runtime only, not persistent)
    window.setConfig = function(key, value) {
        window.CONFIG[key] = value;
    };

    // Export for use in other scripts
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.CONFIG;
    }
})();