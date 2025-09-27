// Static configuration for Cloudflare Pages deployment
// This file contains non-sensitive default configurations
// For sensitive data, use server-side authentication

(function() {
    'use strict';

    // Public configuration (safe to expose)
    window.CONFIG = {
        // Site Configuration
        SITE_NAME: 'junegood',
        SITE_AUTHOR: 'Dongjune Kim',
        SITE_URL: 'https://junegood.pages.dev',

        // Storage Keys (safe to expose)
        STORAGE_KEY_JOURNALS: 'junegood_journals',
        STORAGE_KEY_COMMENTS: 'junegood_comments',
        STORAGE_KEY_AUTH: 'junegood_admin_auth',
        STORAGE_KEY_CREDENTIALS: 'junegood_admin_creds',
        STORAGE_KEY_ATTEMPTS: 'junegood_login_attempts',
        STORAGE_KEY_LOCKOUT: 'junegood_lockout_until',

        // Session Configuration (in milliseconds)
        SESSION_TIMEOUT: 1800000,  // 30 minutes
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_TIME: 900000,  // 15 minutes

        // Development
        DEV_PORT: 8000,
        DEBUG_MODE: false,

        // GitHub Configuration (public info)
        GITHUB_REPO: 'https://github.com/rafiki3816/junegood.git',
        GITHUB_ISSUES: 'https://github.com/rafiki3816/junegood/issues',

        // API Endpoints
        DATA_JOURNALS_PATH: '/data/journals.json',

        // Design System
        PRIMARY_COLOR: '#0066cc',
        SECONDARY_COLOR: '#6c757d',
        SUCCESS_COLOR: '#28a745',
        DANGER_COLOR: '#dc3545',
        BREAKPOINT_MOBILE: 768,
        BREAKPOINT_TABLET: 1024,
        BREAKPOINT_DESKTOP: 1440,

        // Authentication (using secure defaults)
        // These will be overridden by encrypted credentials stored in localStorage
        ADMIN_USERNAME: 'admin',
        ADMIN_PASSWORD: null  // Never store password in static files
    };

    // Helper function to get config value
    window.getConfig = function(key, defaultValue) {
        return window.CONFIG[key] !== undefined ? window.CONFIG[key] : defaultValue;
    };

    // Helper function to set config value (runtime only)
    window.setConfig = function(key, value) {
        window.CONFIG[key] = value;
    };

    // Check for local overrides (for development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Try to load local .env file for development
        fetch('/.env')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
            })
            .then(text => {
                if (text) {
                    parseEnvFile(text);
                }
            })
            .catch(() => {
                // Ignore errors in production
            });
    }

    function parseEnvFile(content) {
        const lines = content.split('\n');
        lines.forEach(line => {
            if (!line || line.startsWith('#')) return;
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                const trimmedKey = key.trim();
                let parsedValue = value;

                // Remove quotes
                if (value.startsWith('"') && value.endsWith('"')) {
                    parsedValue = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    parsedValue = value.slice(1, -1);
                }

                // Convert types
                if (parsedValue === 'true') {
                    parsedValue = true;
                } else if (parsedValue === 'false') {
                    parsedValue = false;
                } else if (!isNaN(parsedValue) && parsedValue !== '') {
                    parsedValue = Number(parsedValue);
                }

                window.CONFIG[trimmedKey] = parsedValue;
            }
        });
    }
})();