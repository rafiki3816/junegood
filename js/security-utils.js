// Security utilities for input validation and XSS prevention

const SecurityUtils = (function() {
    'use strict';

    // HTML entity encoding to prevent XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return String(text).replace(/[&<>"'`=\/]/g, function(s) {
            return map[s];
        });
    }

    // Sanitize user input for safe display
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        // Remove script tags and event handlers
        input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        input = input.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
        input = input.replace(/on\w+\s*=\s*'[^']*'/gi, '');
        input = input.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

        // Escape HTML entities
        return escapeHtml(input);
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Validate URL format
    function validateUrl(url) {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    // Sanitize URL to prevent javascript: and data: protocols
    function sanitizeUrl(url) {
        if (!url) return '#';

        const sanitized = url.trim().toLowerCase();
        if (sanitized.startsWith('javascript:') ||
            sanitized.startsWith('data:') ||
            sanitized.startsWith('vbscript:')) {
            return '#';
        }

        return escapeHtml(url);
    }

    // Validate file upload
    function validateFileUpload(file, options = {}) {
        const defaults = {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        };

        const config = { ...defaults, ...options };

        // Check file size
        if (file.size > config.maxSize) {
            return { valid: false, error: `File size exceeds ${config.maxSize / 1024 / 1024}MB limit` };
        }

        // Check MIME type
        if (!config.allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Invalid file type' };
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = config.allowedExtensions.some(ext => fileName.endsWith(ext));
        if (!hasValidExtension) {
            return { valid: false, error: 'Invalid file extension' };
        }

        return { valid: true };
    }

    // Generate secure random token
    function generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Rate limiting helper
    const rateLimiter = (function() {
        const attempts = new Map();

        return {
            check: function(key, maxAttempts = 5, windowMs = 60000) {
                const now = Date.now();
                const userAttempts = attempts.get(key) || [];

                // Remove old attempts outside the window
                const recentAttempts = userAttempts.filter(time => now - time < windowMs);

                if (recentAttempts.length >= maxAttempts) {
                    return { allowed: false, retryAfter: windowMs - (now - recentAttempts[0]) };
                }

                recentAttempts.push(now);
                attempts.set(key, recentAttempts);

                return { allowed: true, remaining: maxAttempts - recentAttempts.length };
            },

            reset: function(key) {
                attempts.delete(key);
            }
        };
    })();

    // Content Security Policy helper
    function generateCSP() {
        return {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            'font-src': ["'self'", 'https://fonts.gstatic.com'],
            'img-src': ["'self'", 'data:', 'https:'],
            'connect-src': ["'self'"],
            'frame-ancestors': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"]
        };
    }

    // HTTPS enforcement
    function enforceHTTPS() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            location.protocol = 'https:';
        }
    }

    // Secure cookie helper
    function setSecureCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict${secure}; HttpOnly`;
    }

    // Public API
    return {
        escapeHtml,
        sanitizeInput,
        validateEmail,
        validateUrl,
        sanitizeUrl,
        validateFileUpload,
        generateSecureToken,
        rateLimiter,
        generateCSP,
        enforceHTTPS,
        setSecureCookie
    };
})();

// Auto-enforce HTTPS on load
if (typeof window !== 'undefined') {
    SecurityUtils.enforceHTTPS();
}