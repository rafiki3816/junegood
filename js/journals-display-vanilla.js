// Display journals from localStorage on the public page - Vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'junegood_journals';
    const COMMENTS_KEY = 'junegood_comments';

    // Get posts from localStorage
    function getPosts() {
        const posts = localStorage.getItem(STORAGE_KEY);
        return posts ? JSON.parse(posts) : [];
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

    // Add a new comment
    function addComment(postId) {
        const nameInput = document.getElementById(`commentName-${postId}`);
        const textInput = document.getElementById(`commentText-${postId}`);

        if (!nameInput || !textInput) return;

        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (!name || !text) return;

        const allComments = getAllComments();

        if (!allComments[postId]) {
            allComments[postId] = [];
        }

        const newComment = {
            id: Date.now().toString(),
            name: name,
            text: text,
            date: new Date().toISOString()
        };

        allComments[postId].unshift(newComment);
        saveComments(allComments);

        // Update the comments display
        const commentsContainer = document.getElementById(`comments-${postId}`);
        if (commentsContainer) {
            commentsContainer.innerHTML = getComments(postId);
        }

        // Clear the form
        nameInput.value = '';
        textInput.value = '';

        // Show success message
        const form = document.getElementById(`commentForm-${postId}`);
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'background: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-top: 10px;';
        successMsg.textContent = 'Comment posted successfully!';
        form.appendChild(successMsg);

        setTimeout(() => successMsg.remove(), 3000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format comment date
    function formatCommentDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
            }
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 30) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }

    // Make addComment function available globally for the form handler
    window.addComment = addComment;

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Convert Markdown to HTML
    function convertMarkdownToHtml(markdown) {
        let html = markdown;

        // Links - Process before italic to avoid conflicts
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #0066cc; text-decoration: none;">$1</a>');

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold - More specific pattern
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic - More specific pattern to avoid conflicts
        html = html.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');

        // Quotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Lists
        html = html.replace(/^\* (.+)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    // Load and display posts
    function loadJournals(category = 'all') {
        const posts = getPosts();
        const container = document.querySelector('.journal-container');

        // Clear ALL posts (both static and dynamic)
        container.innerHTML = '';

        // Filter published posts
        let publishedPosts = posts.filter(p => p.status === 'published');

        // Filter by category if specified
        if (category !== 'all') {
            publishedPosts = publishedPosts.filter(p => p.category === category);
        }

        // Sort by date (newest first)
        publishedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Add dynamic posts
        publishedPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'journal-post';
            article.dataset.category = post.category;

            article.innerHTML = `
                ${post.image ? `
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                ` : ''}
                <div class="post-content">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <h2>${post.title}</h2>
                    <p>${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                    <a href="#" class="read-more" data-id="${post.id}">Read more →</a>
                </div>
            `;

            // Insert before empty state
            const emptyState = container.querySelector('.empty-state');
            if (emptyState) {
                container.insertBefore(article, emptyState);
            } else {
                container.appendChild(article);
            }
        });

        // Show/hide posts based on category
        const allPosts = container.querySelectorAll('.journal-post');
        allPosts.forEach(post => {
            if (category === 'all' || post.dataset.category === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        // updateEmptyState(); // Disabled since we have example posts
    }

    // Show full article
    function showFullArticle(postId) {
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);

        if (!post) return;

        const overlay = document.createElement('div');
        overlay.className = 'full-article-overlay';
        overlay.innerHTML = `
            <div class="full-article-container">
                <button class="close-article">&times;</button>
                <article class="full-article">
                    ${post.image ? `
                    <div class="article-hero">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-category">${post.category}</span>
                            <span class="article-date">${formatDate(post.date)}</span>
                        </div>
                        <h1 class="article-title">${post.title}</h1>
                        <div class="article-body">
                            ${convertMarkdownToHtml(post.content)}
                        </div>
                        ${post.tags ? `
                        <div class="article-tags">
                            ${post.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                        </div>
                        ` : ''}
                        ${post.referenceUrl ? `
                        <div class="article-reference" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <strong style="color: #666;">Reference:</strong>
                            <a href="${post.referenceUrl}" target="_blank" style="color: #0066cc; text-decoration: none;">
                                ${post.referenceUrl}
                            </a>
                        </div>
                        ` : ''}

                        <!-- Comments Section -->
                        <div class="comments-section" style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0;">
                            <h3 style="font-size: 24px; margin-bottom: 25px; color: #333;">Comments</h3>

                            <!-- Comment Form -->
                            <div class="comment-form" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                <h4 style="font-size: 16px; margin-bottom: 15px; color: #666;">Leave a comment</h4>
                                <form id="commentForm-${postId}">
                                    <div style="margin-bottom: 15px;">
                                        <input type="text" id="commentName-${postId}" placeholder="Your name" required
                                            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <textarea id="commentText-${postId}" placeholder="Write your comment..." required
                                            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-height: 100px; resize: vertical;"></textarea>
                                    </div>
                                    <button type="submit" style="background: #0066cc; color: white; padding: 10px 25px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
                                        Post Comment
                                    </button>
                                </form>
                            </div>

                            <!-- Comments List -->
                            <div class="comments-list" id="comments-${postId}">
                                ${getComments(postId)}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Setup comment form handler
        const commentForm = document.getElementById(`commentForm-${postId}`);
        if (commentForm) {
            commentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addComment(postId);
            });
        }

        // Close handlers
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay || e.target.classList.contains('close-article')) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        });
    }

    // Update empty state - removed since we have example posts

    // Event handlers
    document.addEventListener('click', function(e) {
        // Read more handler
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            const postId = e.target.dataset.id;

            if (postId) {
                showFullArticle(postId);
            } else {
                // Static post - use original href if exists
                const href = e.target.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            }
        }

        // Category filter handlers
        if (e.target.closest('.journal-nav a')) {
            e.preventDefault();
            const link = e.target.closest('.journal-nav a');
            const category = link.getAttribute('href').substring(1);

            // Update active state
            document.querySelectorAll('.journal-nav a').forEach(a => {
                a.classList.remove('active');
            });
            link.classList.add('active');

            loadJournals(category);
        }
    });


    // Initialize - load all journals
    loadJournals('all');

    // Add styles for full article view
    if (!document.getElementById('journalDisplayStyles')) {
        const style = document.createElement('style');
        style.id = 'journalDisplayStyles';
        style.textContent = `
            .full-article-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                overflow-y: auto;
                padding: 40px 20px;
            }

            .full-article-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                position: relative;
            }

            .close-article {
                position: absolute;
                top: 20px;
                right: 20px;
                background: white;
                border: none;
                font-size: 30px;
                cursor: pointer;
                z-index: 10;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .full-article {
                padding-bottom: 40px;
            }

            .article-hero {
                width: 100%;
                height: 400px;
                overflow: hidden;
                border-radius: 8px 8px 0 0;
            }

            .article-hero img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .article-content {
                padding: 40px;
            }

            .article-meta {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
                font-size: 14px;
                color: #666;
            }

            .article-category {
                color: #0066cc;
                text-transform: uppercase;
                font-weight: 600;
            }

            .article-title {
                font-size: 36px;
                margin-bottom: 30px;
                line-height: 1.2;
            }

            .article-body {
                font-size: 16px;
                line-height: 1.8;
                color: #444;
            }

            .article-body h2 {
                margin: 30px 0 15px;
                font-size: 24px;
            }

            .article-body h3 {
                margin: 25px 0 12px;
                font-size: 20px;
            }

            .article-body p {
                margin-bottom: 15px;
            }

            .article-body blockquote {
                border-left: 4px solid #0066cc;
                padding-left: 20px;
                margin: 20px 0;
                font-style: italic;
                color: #666;
            }

            .article-tags {
                margin-top: 30px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .tag {
                background: #f0f0f0;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 12px;
            }

            /* Comment Section Styles */
            .comments-section {
                margin-top: 50px;
                padding-top: 30px;
                border-top: 2px solid #e0e0e0;
            }

            .comment-form {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }

            .comment-form input,
            .comment-form textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                font-family: inherit;
            }

            .comment-form input:focus,
            .comment-form textarea:focus {
                outline: none;
                border-color: #0066cc;
                box-shadow: 0 0 0 2px rgba(0,102,204,0.1);
            }

            .comment-form button {
                background: #0066cc;
                color: white;
                padding: 10px 25px;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.3s;
            }

            .comment-form button:hover {
                background: #0052a3;
            }

            .comments-list {
                max-height: 500px;
                overflow-y: auto;
            }

            @media screen and (max-width: 768px) {
                .full-article-container {
                    margin: 0;
                    border-radius: 0;
                }

                .article-hero {
                    height: 250px;
                }

                .article-content {
                    padding: 20px;
                }

                .article-title {
                    font-size: 28px;
                }
            }
        `;
        document.head.appendChild(style);
    }
});