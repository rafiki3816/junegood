document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const thumbnailsTrack = document.getElementById('thumbnailsTrack');
    const gridContainer = document.getElementById('gridContainer');
    const gridView = document.getElementById('gridView');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const gridCloseBtn = document.getElementById('gridCloseBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');

    let currentSlide = 0;
    let isPlaying = false;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    let currentZoom = 'fit';
    let zoomLevel = 1;
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    // Zoom controls
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomFitBtn = document.getElementById('zoomFitBtn');
    const zoom100Btn = document.getElementById('zoom100Btn');
    const zoomIndicator = document.getElementById('zoomIndicator');

    // Initialize
    function init() {
        totalSlidesEl.textContent = slides.length;
        createThumbnails();
        createGridItems();
        updateSlide();
        setupEventListeners();
        setupTouchEvents();
        setupKeyboardNavigation();
        setupZoomControls();
    }

    // Create thumbnails
    function createThumbnails() {
        slides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            if (index === 0) thumb.classList.add('active');

            const img = document.createElement('img');
            img.src = slide.querySelector('img').src;
            img.alt = `Thumbnail ${index + 1}`;

            thumb.appendChild(img);
            thumb.addEventListener('click', () => goToSlide(index));
            thumbnailsTrack.appendChild(thumb);
        });
    }

    // Create grid items
    function createGridItems() {
        slides.forEach((slide, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            const img = document.createElement('img');
            img.src = slide.querySelector('img').src;
            img.alt = slide.dataset.location;

            const info = document.createElement('div');
            info.className = 'grid-item-info';
            info.innerHTML = `
                <h4>${slide.dataset.location}</h4>
                <p>${slide.dataset.date}</p>
            `;

            gridItem.appendChild(img);
            gridItem.appendChild(info);
            gridItem.addEventListener('click', () => {
                goToSlide(index);
                closeGrid();
            });

            gridContainer.appendChild(gridItem);
        });
    }

    // Update slide
    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentSlide);
        });

        // Update info
        const activeSlide = slides[currentSlide];
        document.querySelector('.carousel-location').textContent = activeSlide.dataset.location;
        document.querySelector('.carousel-date').textContent = activeSlide.dataset.date;
        currentSlideEl.textContent = currentSlide + 1;

        // Scroll thumbnails
        scrollThumbnails();
    }

    // Scroll thumbnails to center active
    function scrollThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const activeThumbnail = thumbnails[currentSlide];
        if (activeThumbnail) {
            const trackWidth = thumbnailsTrack.parentElement.offsetWidth;
            const thumbLeft = activeThumbnail.offsetLeft;
            const thumbWidth = activeThumbnail.offsetWidth;
            const scrollPosition = thumbLeft - (trackWidth / 2) + (thumbWidth / 2);

            thumbnailsTrack.style.transform = `translateX(${-scrollPosition}px)`;
        }
    }

    // Navigation functions
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }

    // Auto play
    function toggleAutoPlay() {
        isPlaying = !isPlaying;
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            autoPlayInterval = setInterval(nextSlide, 4000);
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            clearInterval(autoPlayInterval);
        }
    }

    // Grid view
    function openGrid() {
        gridView.style.display = 'block';
        setTimeout(() => {
            gridView.style.opacity = '1';
        }, 10);
    }

    function closeGrid() {
        gridView.style.opacity = '0';
        setTimeout(() => {
            gridView.style.display = 'none';
        }, 300);
    }

    // Touch events
    function setupTouchEvents() {
        const carouselMain = document.querySelector('.carousel-main');

        carouselMain.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        carouselMain.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (gridView.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeGrid();
                }
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                    prevSlide();
                    break;
                case 'ArrowRight':
                    nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
                case 'g':
                    openGrid();
                    break;
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        playPauseBtn.addEventListener('click', toggleAutoPlay);
        gridViewBtn.addEventListener('click', openGrid);
        gridCloseBtn.addEventListener('click', closeGrid);

        // Pause autoplay on hover
        const carouselMain = document.querySelector('.carousel-main');
        carouselMain.addEventListener('mouseenter', () => {
            if (isPlaying) {
                clearInterval(autoPlayInterval);
            }
        });

        carouselMain.addEventListener('mouseleave', () => {
            if (isPlaying) {
                autoPlayInterval = setInterval(nextSlide, 4000);
            }
        });
    }

    // Setup zoom controls
    function setupZoomControls() {
        zoomInBtn.addEventListener('click', () => {
            if (zoomLevel < 3) {
                zoomLevel = Math.min(zoomLevel * 1.5, 3);
                applyZoom();
            }
        });

        zoomOutBtn.addEventListener('click', () => {
            if (zoomLevel > 0.5) {
                zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
                applyZoom();
            }
        });

        zoomFitBtn.addEventListener('click', () => {
            currentZoom = 'fit';
            zoomLevel = 1;
            applyZoom();
        });

        zoom100Btn.addEventListener('click', () => {
            currentZoom = '100';
            const currentImg = slides[currentSlide].querySelector('img');
            const container = document.querySelector('.carousel-main');

            // Calculate zoom level for 100% size
            const naturalWidth = currentImg.naturalWidth;
            const containerWidth = container.offsetWidth;
            zoomLevel = naturalWidth / (containerWidth * 0.9);

            applyZoom();
            showZoomIndicator('100%');
        });

        // Setup image click for zoom toggle
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            img.addEventListener('click', (e) => {
                if (!isDragging) {
                    if (currentZoom === 'fit') {
                        // Zoom to click point
                        const rect = img.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        currentZoom = '100';
                        const container = document.querySelector('.carousel-main');
                        const naturalWidth = img.naturalWidth;
                        const containerWidth = container.offsetWidth;
                        zoomLevel = naturalWidth / (containerWidth * 0.9);

                        applyZoom();

                        // Center on clicked point
                        const scrollContainer = slide;
                        const scrollX = (x * zoomLevel) - (container.offsetWidth / 2);
                        const scrollY = (y * zoomLevel) - (container.offsetHeight / 2);
                        scrollContainer.scrollLeft = scrollX;
                        scrollContainer.scrollTop = scrollY;
                    } else {
                        currentZoom = 'fit';
                        zoomLevel = 1;
                        applyZoom();
                    }
                }
            });
        });

        // Setup pan functionality
        setupPan();
    }

    function applyZoom() {
        const currentImg = slides[currentSlide].querySelector('img');
        const slide = slides[currentSlide];

        if (currentZoom === 'fit' && zoomLevel === 1) {
            currentImg.style.transform = '';
            currentImg.style.maxWidth = '90%';
            currentImg.style.maxHeight = '85vh';
            currentImg.style.cursor = 'zoom-in';
            slide.classList.remove('zoomed');
            slide.style.overflow = 'hidden';
        } else {
            currentImg.style.transform = `scale(${zoomLevel})`;
            currentImg.style.maxWidth = 'none';
            currentImg.style.maxHeight = 'none';
            currentImg.style.cursor = zoomLevel > 1 ? 'move' : 'zoom-in';
            slide.classList.add('zoomed');
            slide.style.overflow = 'auto';
        }

        // Update zoom indicator
        const percentage = Math.round(zoomLevel * 100);
        showZoomIndicator(`${percentage}%`);

        // Update button states
        updateZoomButtons();
    }

    function showZoomIndicator(text) {
        zoomIndicator.textContent = text;
        zoomIndicator.classList.add('visible');
        clearTimeout(zoomIndicator.hideTimeout);
        zoomIndicator.hideTimeout = setTimeout(() => {
            zoomIndicator.classList.remove('visible');
        }, 2000);
    }

    function updateZoomButtons() {
        // Reset all active states
        [zoomFitBtn, zoom100Btn].forEach(btn => btn.classList.remove('active'));

        if (currentZoom === 'fit' && zoomLevel === 1) {
            zoomFitBtn.classList.add('active');
        } else if (currentZoom === '100') {
            zoom100Btn.classList.add('active');
        }
    }

    function setupPan() {
        slides.forEach(slide => {
            slide.addEventListener('mousedown', (e) => {
                if (slide.classList.contains('zoomed') && zoomLevel > 1) {
                    isDragging = true;
                    startX = e.pageX - slide.offsetLeft;
                    startY = e.pageY - slide.offsetTop;
                    scrollLeft = slide.scrollLeft;
                    scrollTop = slide.scrollTop;
                    slide.style.cursor = 'grabbing';
                }
            });

            slide.addEventListener('mouseleave', () => {
                isDragging = false;
                slide.style.cursor = zoomLevel > 1 ? 'move' : 'zoom-in';
            });

            slide.addEventListener('mouseup', () => {
                isDragging = false;
                slide.style.cursor = zoomLevel > 1 ? 'move' : 'zoom-in';
            });

            slide.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - slide.offsetLeft;
                const y = e.pageY - slide.offsetTop;
                const walkX = (x - startX) * 2;
                const walkY = (y - startY) * 2;
                slide.scrollLeft = scrollLeft - walkX;
                slide.scrollTop = scrollTop - walkY;
            });
        });
    }

    // Keyboard navigation update
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (gridView.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeGrid();
                }
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                    if (currentZoom === 'fit' || zoomLevel === 1) {
                        prevSlide();
                    }
                    break;
                case 'ArrowRight':
                    if (currentZoom === 'fit' || zoomLevel === 1) {
                        nextSlide();
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
                case 'g':
                    openGrid();
                    break;
                case '+':
                case '=':
                    zoomInBtn.click();
                    break;
                case '-':
                case '_':
                    zoomOutBtn.click();
                    break;
                case '0':
                    zoomFitBtn.click();
                    break;
                case '1':
                    zoom100Btn.click();
                    break;
                case 'Escape':
                    if (currentZoom !== 'fit' || zoomLevel !== 1) {
                        currentZoom = 'fit';
                        zoomLevel = 1;
                        applyZoom();
                    }
                    break;
            }
        });
    }

    // Update slide function to reset zoom
    const originalUpdateSlide = updateSlide;
    function updateSlide() {
        // Reset zoom when changing slides
        currentZoom = 'fit';
        zoomLevel = 1;
        slides[currentSlide].classList.remove('zoomed');
        slides[currentSlide].style.overflow = 'hidden';

        originalUpdateSlide();
    }

    // Initialize carousel
    init();
});