// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to navigation
    const nav = document.querySelector('.nav, #navigation');
    if (nav) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
    }

    // Add ARIA labels to menu toggle
    const menuToggle = document.querySelector('#menuToggle');
    if (menuToggle) {
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Keyboard navigation for menu items
    const menuItems = document.querySelectorAll('.nav a');
    menuItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');

        item.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (index + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = index === 0 ? menuItems.length - 1 : index - 1;
                    menuItems[prevIndex].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    menuItems[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                    break;
            }
        });
    });

    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('tabindex', '1');
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('#wrap') || document.querySelector('main');
    if (mainContent) {
        mainContent.setAttribute('role', 'main');
        mainContent.setAttribute('id', 'main-content');
    }

    // Image alt text enhancement
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        const src = img.src;
        const fileName = src.split('/').pop().split('.')[0];
        const altText = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        img.setAttribute('alt', altText);
    });

    // Form accessibility
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        if (!input.getAttribute('id')) {
            const id = 'input-' + Math.random().toString(36).substr(2, 9);
            input.setAttribute('id', id);
        }

        // Add aria-label if no label exists
        if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`)) {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder) {
                input.setAttribute('aria-label', placeholder);
            }
        }
    });

    // Focus management
    let focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    // Trap focus in modal when open
    const modals = document.querySelectorAll('.modal, .lightbox, [role="dialog"]');
    modals.forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableInModal = modal.querySelectorAll(
                    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                );

                if (focusableInModal.length === 0) return;

                const firstFocusable = focusableInModal[0];
                const lastFocusable = focusableInModal[focusableInModal.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }

            if (e.key === 'Escape') {
                const closeBtn = modal.querySelector('.close, .modal-close, [aria-label="Close"]');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        });
    });

    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };

    // Add focus visible polyfill
    if (!CSS.supports('selector(:focus-visible)')) {
        document.addEventListener('keydown', function() {
            document.body.classList.add('keyboard-nav');
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });
    }
});

// Add accessibility styles
const style = document.createElement('style');
style.textContent = `
    /* Skip link */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 100000;
    }

    .skip-link:focus {
        top: 0;
    }

    /* Screen reader only text */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border: 0;
    }

    /* Focus styles */
    :focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
    }

    .keyboard-nav *:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
    }

    body:not(.keyboard-nav) *:focus {
        outline: none;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :focus {
            outline: 3px solid currentColor;
            outline-offset: 3px;
        }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
document.head.appendChild(style);