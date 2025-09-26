// Global variables
let currentIndex = 1;
let totalImages = 0;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', function() {
	// Get elements
	const lightbox = document.querySelector('#lightbox');
	const block = document.querySelector('#block');
	const imgs = document.querySelectorAll('figure > img');
	const currentPhotoEl = document.getElementById('currentPhoto');
	const totalPhotosEl = document.getElementById('totalPhotos');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const figure = document.querySelector('figure');

	// Set total images count
	totalImages = imgs.length;
	if (totalPhotosEl) {
		totalPhotosEl.textContent = totalImages;
	}

	// Open lightbox
	window.lightbox_open = function(num) {
		lightbox.setAttribute('class', 'active');
		block.setAttribute('class', 'active');
		currentIndex = num;
		change_img(num);

		// Prevent body scroll when lightbox is open
		document.body.style.overflow = 'hidden';
	}

	// Close lightbox
	window.lightbox_close = function() {
		lightbox.removeAttribute('class');
		block.removeAttribute('class');

		// Restore body scroll
		document.body.style.overflow = '';
	}

	// Change image
	window.change_img = function(val) {
		// Remove active class from all images
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].removeAttribute('class');
		}

		// Set active class to current image
		imgs[val - 1].setAttribute('class', 'active');

		// Update counter
		if (currentPhotoEl) {
			currentPhotoEl.textContent = val;
		}

		// Update button states
		updateButtonStates();

		// Preload adjacent images
		preloadImages(val);
	}

	// Navigate to next image
	window.nextImage = function() {
		if (currentIndex < totalImages) {
			currentIndex++;
			change_img(currentIndex);
		}
	}

	// Navigate to previous image
	window.prevImage = function() {
		if (currentIndex > 1) {
			currentIndex--;
			change_img(currentIndex);
		}
	}

	// Update button states
	function updateButtonStates() {
		if (!prevBtn || !nextBtn) return;

		// Disable/enable prev button
		if (currentIndex === 1) {
			prevBtn.style.opacity = '0.3';
			prevBtn.style.cursor = 'not-allowed';
		} else {
			prevBtn.style.opacity = '1';
			prevBtn.style.cursor = 'pointer';
		}

		// Disable/enable next button
		if (currentIndex === totalImages) {
			nextBtn.style.opacity = '0.3';
			nextBtn.style.cursor = 'not-allowed';
		} else {
			nextBtn.style.opacity = '1';
			nextBtn.style.cursor = 'pointer';
		}
	}

	// Keyboard navigation
	document.addEventListener('keydown', function(e) {
		if (lightbox && lightbox.classList.contains('active')) {
			switch(e.key) {
				case 'ArrowLeft':
					prevImage();
					break;
				case 'ArrowRight':
					nextImage();
					break;
				case 'Escape':
					lightbox_close();
					break;
			}
		}
	});

	// Touch events for mobile swipe
	if (figure) {
		// Touch start
		figure.addEventListener('touchstart', function(e) {
			touchStartX = e.changedTouches[0].screenX;
			isDragging = true;
		}, { passive: true });

		// Touch end
		figure.addEventListener('touchend', function(e) {
			if (!isDragging) return;

			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
			isDragging = false;
		}, { passive: true });
	}

	// Handle swipe gesture
	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swiped left - next image
				nextImage();
			} else {
				// Swiped right - previous image
				prevImage();
			}
		}
	}

	// Close lightbox when clicking on overlay
	if (block) {
		block.addEventListener('click', function() {
			lightbox_close();
		});
	}

	// Preload adjacent images for smoother experience
	function preloadImages(index) {
		// Preload previous and next images
		if (index > 1 && imgs[index - 2]) {
			const prevImg = new Image();
			prevImg.src = imgs[index - 2].src;
		}
		if (index < totalImages && imgs[index]) {
			const nextImg = new Image();
			nextImg.src = imgs[index].src;
		}
	}

	console.log('Lightbox Enhanced loaded successfully');
});