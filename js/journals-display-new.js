// Display journals from files on the public page
document.addEventListener('DOMContentLoaded', function() {
    const COMMENTS_KEY = 'junegood_comments';
    let loadedJournals = []; // Store journals for expand functionality

    // Listen for journals loaded event
    window.addEventListener('journalsLoaded', function(event) {
        const journals = event.detail.journals;
        loadedJournals = journals; // Store for later use
        displayJournals(journals);
        setupFilters(journals);
    });

    // Display journals
    function displayJournals(journals) {
        const container = document.querySelector('.journal-container');
        if (!container) return;

        if (journals.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No journals available yet.</p>';
            return;
        }

        // Sort journals by date (newest first)
        journals.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Generate HTML for each journal
        const journalsHTML = journals.map(post => createJournalHTML(post)).join('');
        container.innerHTML = journalsHTML;

        // Initialize comment functionality
        journals.forEach(post => {
            initializeComments(post.id);
        });
    }

    // Create HTML for a single journal
    function createJournalHTML(post, isExpanded = false) {
        const formattedDate = formatDate(post.date);
        const truncatedContent = post.excerpt || post.content.substring(0, 150) + '...';

        if (isExpanded) {
            return `
                <article class="journal-post expanded" data-category="${post.category}" data-id="${post.id}">
                    ${post.image ? `
                        <div class="post-image">
                            <img src="${post.image}" alt="${escapeHtml(post.title)}">
                        </div>
                    ` : ''}

                    <div class="post-content">
                        <time class="post-date">${formattedDate}</time>
                        <h2>${escapeHtml(post.title)}</h2>
                        <div class="full-content">${formatContent(post.content)}</div>

                        ${post.tags ? `
                            <div class="journal-tags" style="margin-top: 20px;">
                                ${post.tags.split(',').map(tag =>
                                    `<span style="display: inline-block; background: #f0f0f0; padding: 5px 10px; margin: 5px; border-radius: 15px; font-size: 12px;">${escapeHtml(tag.trim())}</span>`
                                ).join('')}
                            </div>
                        ` : ''}

                        <a href="javascript:void(0)" class="read-more" onclick="collapsePost('${post.id}')">
                            ← Show Less
                        </a>
                    </div>
                </article>
            `;
        } else {
            return `
                <article class="journal-post" data-category="${post.category}" data-id="${post.id}">
                    ${post.image ? `
                        <div class="post-image">
                            <img src="${post.image}" alt="${escapeHtml(post.title)}">
                        </div>
                    ` : ''}

                    <div class="post-content">
                        <time class="post-date">${formattedDate}</time>
                        <h2>${escapeHtml(post.title)}</h2>
                        <p>${escapeHtml(truncatedContent)}</p>
                        <a href="javascript:void(0)" class="read-more" onclick="expandPost('${post.id}')">
                            Read More →
                        </a>
                    </div>
                </article>
            `;
        }
    }

    // Setup category filters
    function setupFilters(journals) {
        const navLinks = document.querySelectorAll('.journal-nav a');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Get category from href
                const category = this.getAttribute('href').replace('#', '');

                // Filter posts
                const posts = document.querySelectorAll('.journal-post');
                posts.forEach(post => {
                    if (category === 'all' || post.dataset.category === category) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
            });
        });
    }

    // Get all comments from localStorage
    function getAllComments() {
        const comments = localStorage.getItem(COMMENTS_KEY);
        return comments ? JSON.parse(comments) : {};
    }

    // Save comments to localStorage
    function saveComments(comments) {
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }

    // Get comments for a specific post
    function getComments(postId) {
        const allComments = getAllComments();
        const postComments = allComments[postId] || [];

        if (postComments.length === 0) {
            return '<p style="color: #999; text-align: center; padding: 20px;">No comments yet. Be the first to comment!</p>';
        }

        return postComments.map(comment => `
            <div style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #333; font-size: 14px;">${escapeHtml(comment.name)}</strong>
                    <span style="color: #999; font-size: 12px;">${formatCommentDate(comment.date)}</span>
                </div>
                <p style="color: #666; line-height: 1.6; margin: 0;">${escapeHtml(comment.text)}</p>
            </div>
        `).join('');
    }

    // Initialize comment functionality for a post
    function initializeComments(postId) {
        // Refresh comments display
        const commentsContainer = document.getElementById(`comments-${postId}`);
        if (commentsContainer) {
            commentsContainer.innerHTML = getComments(postId);
        }
    }

    // Expand post to show full content
    window.expandPost = function(postId) {
        const post = loadedJournals.find(j => j.id === postId);
        if (!post) return;

        const postElement = document.querySelector(`[data-id="${postId}"]`);
        if (postElement) {
            // Store scroll position
            const scrollTop = postElement.offsetTop;

            // Replace with expanded version
            postElement.outerHTML = createJournalHTML(post, true);

            // Scroll to the expanded post
            window.scrollTo({
                top: scrollTop - 20,
                behavior: 'smooth'
            });
        }
    };

    // Collapse post back to summary
    window.collapsePost = function(postId) {
        const post = loadedJournals.find(j => j.id === postId);
        if (!post) return;

        const postElement = document.querySelector(`[data-id="${postId}"]`);
        if (postElement) {
            // Store scroll position
            const scrollTop = postElement.offsetTop;

            // Replace with collapsed version
            postElement.outerHTML = createJournalHTML(post, false);

            // Scroll to the collapsed post
            window.scrollTo({
                top: scrollTop - 20,
                behavior: 'smooth'
            });
        }
    };

    // Add a new comment
    window.addComment = function(postId) {
        const nameInput = document.getElementById(`commentName-${postId}`);
        const textInput = document.getElementById(`commentText-${postId}`);

        if (!nameInput || !textInput) return;

        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (!name || !text) {
            alert('Please enter both your name and comment.');
            return;
        }

        const allComments = getAllComments();
        if (!allComments[postId]) {
            allComments[postId] = [];
        }

        allComments[postId].push({
            name: name,
            text: text,
            date: new Date().toISOString()
        });

        saveComments(allComments);

        // Clear inputs and refresh display
        nameInput.value = '';
        textInput.value = '';
        initializeComments(postId);
    };

    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatContent(content) {
        // Convert markdown-style headers to HTML
        let formatted = escapeHtml(content)
            .replace(/## (.*?)(\n|$)/g, '<h3>$1</h3>')
            .replace(/### (.*?)(\n|$)/g, '<h4>$1</h4>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${formatted}</p>`;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function formatCommentDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }
});