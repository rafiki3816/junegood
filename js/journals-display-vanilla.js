// Display journals from localStorage on the public page - Vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'junegood_journals';

    // Get posts from localStorage
    function getPosts() {
        const posts = localStorage.getItem(STORAGE_KEY);
        return posts ? JSON.parse(posts) : [];
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Convert Markdown to HTML
    function convertMarkdownToHtml(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

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
                    </div>
                </article>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

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