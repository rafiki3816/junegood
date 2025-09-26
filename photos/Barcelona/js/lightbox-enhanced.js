// Global variables
let currentIndex = 1;
let totalImages = 88;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;

// Initialize
const lightbox = document.querySelector('#lightbox');
const block = document.querySelector('#block');
const imgs = document.querySelectorAll('figure > img');
const currentPhotoEl = document.getElementById('currentPhoto');
const totalPhotosEl = document.getElementById('totalPhotos');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Set total photos count
totalPhotosEl.textContent = totalImages;

// Open lightbox
function lightbox_open(num) {
	lightbox.setAttribute('class', 'active');
	block.setAttribute('class', 'active');
	currentIndex = num;
	change_img(num);

	// Prevent body scroll when lightbox is open
	document.body.style.overflow = 'hidden';
}

// Close lightbox
function lightbox_close() {
	lightbox.removeAttribute('class');
	block.removeAttribute('class');

	// Restore body scroll
	document.body.style.overflow = '';
}

// Change image
function change_img(val) {
	// Remove active class from all images
	for (let i = 0; i < imgs.length; i++) {
		imgs[i].removeAttribute('class');
	}

	// Set active class to current image
	imgs[val - 1].setAttribute('class', 'active');

	// Update counter
	currentPhotoEl.textContent = val;

	// Update button states
	updateButtonStates();
}

// Navigate to next image
function nextImage() {
	if (currentIndex < totalImages) {
		currentIndex++;
		change_img(currentIndex);
	}
}

// Navigate to previous image
function prevImage() {
	if (currentIndex > 1) {
		currentIndex--;
		change_img(currentIndex);
	}
}

// Update button states
function updateButtonStates() {
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
	if (lightbox.classList.contains('active')) {
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
const figure = document.querySelector('figure');

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

// Click outside image to close (optional)
figure.addEventListener('click', function(e) {
	if (e.target === figure) {
		// Uncomment to enable close on background click
		// lightbox_close();
	}
});

// Close lightbox when clicking on overlay
block.addEventListener('click', function() {
	lightbox_close();
});

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

// Add image preloading to change_img function
const original_change_img = change_img;
change_img = function(val) {
	original_change_img(val);
	preloadImages(val);
}

// Add loading indicator (optional)
function showLoading() {
	// Add loading spinner if needed
}

function hideLoading() {
	// Remove loading spinner if needed
}

// Image load event handling
imgs.forEach((img, index) => {
	img.addEventListener('load', function() {
		hideLoading();
	});

	img.addEventListener('error', function() {
		console.error(`Failed to load image ${index + 1}`);
		hideLoading();
	});
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
	// Any initialization code here
	console.log('Lightbox Enhanced loaded successfully');
});