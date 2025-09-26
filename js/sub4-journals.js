document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and posts
    const navLinks = document.querySelectorAll('.journal-nav a');
    const posts = document.querySelectorAll('.journal-post');

    // Filter function
    function filterPosts(category) {
        posts.forEach(post => {
            const postCategory = post.getAttribute('data-category');

            if (category === 'all' || postCategory === category) {
                // Show post with animation
                post.classList.remove('hidden');
                setTimeout(() => {
                    post.classList.remove('fade-out');
                }, 10);
            } else {
                // Hide post with animation
                post.classList.add('fade-out');
                setTimeout(() => {
                    post.classList.add('hidden');
                }, 300);
            }
        });
    }

    // Add click event to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Get category from href
            const category = this.getAttribute('href').replace('#', '');

            // Filter posts
            filterPosts(category);
        });
    });

    // Handle read more links (placeholder for future development)
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Future: Navigate to full article page
            console.log('Article clicked:', this.closest('.journal-post').querySelector('h2').textContent);
        });
    });

    // Lazy loading for images (optional enhancement)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.animation = 'fadeIn 0.5s ease';
                    observer.unobserve(img);
                }
            });
        });

        const postImages = document.querySelectorAll('.post-image img');
        postImages.forEach(img => imageObserver.observe(img));
    }

    // Add keyboard navigation (optional enhancement)
    document.addEventListener('keydown', function(e) {
        const activeLink = document.querySelector('.journal-nav a.active');
        const links = Array.from(navLinks);
        const currentIndex = links.indexOf(activeLink);

        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            links[currentIndex - 1].click();
        } else if (e.key === 'ArrowRight' && currentIndex < links.length - 1) {
            links[currentIndex + 1].click();
        }
    });

    // Initialize with all posts visible
    filterPosts('all');
});