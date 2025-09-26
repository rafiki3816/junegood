// Lazy Loading Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback to Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Progressive image loading
    const progressiveImages = document.querySelectorAll('.progressive-image');
    progressiveImages.forEach(container => {
        const smallImg = container.querySelector('.img-small');
        const largeImg = container.querySelector('.img-large');

        if (smallImg && largeImg) {
            // Load small image first
            const tempImg = new Image();
            tempImg.src = smallImg.dataset.src;
            tempImg.onload = function() {
                smallImg.src = tempImg.src;
                smallImg.classList.add('loaded');
            };

            // Then load large image
            const img = new Image();
            img.src = largeImg.dataset.src;
            img.onload = function() {
                largeImg.src = img.src;
                largeImg.classList.add('loaded');
                setTimeout(() => {
                    smallImg.style.display = 'none';
                }, 250);
            };
        }
    });
});

// Add fade-in effect styles
const style = document.createElement('style');
style.textContent = `
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s;
    }

    img.loaded {
        opacity: 1;
    }

    .progressive-image {
        position: relative;
        overflow: hidden;
    }

    .progressive-image .img-small {
        filter: blur(5px);
        transition: opacity 0.3s;
    }

    .progressive-image .img-large {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .progressive-image .img-large.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);