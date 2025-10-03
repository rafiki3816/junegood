// Display journals from files on the public page
let loadedJournals = []; // Store journals for expand functionality - moved to global scope

document.addEventListener('DOMContentLoaded', function() {
    const COMMENTS_KEY = 'junegood_comments';

    // Listen for journals loaded event
    window.addEventListener('journalsLoaded', function(event) {
        const journals = event.detail.journals;
        loadedJournals = journals; // Store for later use
        displayJournals(journals);
        setupFilters(journals);
    });

    // Create mini gallery with 6 thumbnails - expose globally for expandPost
    window.createMiniGallery = function(cityName, imageList) {
        if (!cityName) return '';

        // Determine file extension
        const jpegCities = [
            'Amsterdam', 'Brussels', 'Hongkong', 'Kyushu', 'LakeTahoe',
            'LosAngeles', 'Napa', 'NewYork', 'Phiphi', 'Rotterdam',
            'Sacramento', 'SanDiego', 'SanFrancisco', 'Taipei'
        ];
        const extension = jpegCities.includes(cityName) ? 'jpeg' : 'jpg';

        // Use provided images or default to first 6
        let images = [];
        if (imageList && imageList.length > 0) {
            images = imageList.slice(0, 6);
        } else {
            // Default: show images 1, 5, 10, 15, 20, 25 for variety
            const defaultNumbers = [1, 5, 10, 15, 20, 25];
            images = defaultNumbers.map(num => `${num}.${extension}`);
        }

        return `
            <div class="mini-gallery" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <h3 style="font-family: Raleway; font-size: 16px; margin-bottom: 15px; color: #666;">Photo Gallery</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 400px;">
                    ${images.map(img => `
                        <a href="lightbox-unified.html?city=${cityName}"
                           style="display: block; aspect-ratio: 1; overflow: hidden; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <img src="photos/${cityName}/img/${img}"
                                 alt="${cityName} photo"
                                 style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;"
                                 onmouseover="this.style.transform='scale(1.05)'"
                                 onmouseout="this.style.transform='scale(1)'"
                                 loading="lazy">
                        </a>
                    `).join('')}
                </div>
                <div style="margin-top: 12px;">
                    <a href="lightbox-unified.html?city=${cityName}"
                       style="color: #10b981; text-decoration: none; font-size: 14px; font-weight: 500;">
                        View Full Gallery →
                    </a>
                </div>
            </div>
        `;
    }

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

                        ${(() => {
                            console.log('Gallery check for post:', post.title, 'galleryCity:', post.galleryCity);
                            return post.galleryCity ? window.createMiniGallery(post.galleryCity, post.galleryImages) : '';
                        })()}

                        ${post.referenceUrl ? `
                            <div style="margin-top: 20px; padding-top: 15px;">
                                <strong style="font-family: Raleway; color: #666;">Reference:</strong>
                                <a href="${post.referenceUrl}" target="_blank" style="color: #0066cc; text-decoration: none; margin-left: 10px;">
                                    ${post.referenceUrl}
                                </a>
                            </div>
                        ` : ''}

                        <a href="javascript:void(0)" class="read-more" onclick="collapsePost('${post.id}')" style="padding-top: 45px; display: inline-block; color: #10b981;">
                            ← Show Less
                        </a>

                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

                        <!-- Comments Section -->
                        <div class="comments-section">
                            <h3 style="font-family: Raleway; font-size: 20px; margin-bottom: 20px;">Comments</h3>

                            <div id="comments-${post.id}" class="comments-list">
                                ${getComments(post.id)}
                            </div>

                            <div class="comment-form" style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                                <h4 style="font-family: Raleway; font-size: 16px; margin-bottom: 15px;">Leave a Comment</h4>
                                <input type="text"
                                       id="commentName-${post.id}"
                                       placeholder="Your name"
                                       maxlength="50"
                                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px; font-family: Raleway;">
                                <textarea id="commentText-${post.id}"
                                          placeholder="Write your comment here..."
                                          maxlength="500"
                                          rows="4"
                                          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px; font-family: Raleway; resize: vertical;"></textarea>
                                <button onclick="addComment('${post.id}')"
                                        style="background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-family: Raleway; font-weight: 600;">
                                    Post Comment
                                </button>
                            </div>
                        </div>
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
        const isAdmin = sessionStorage.getItem('junegood_admin_auth') === 'true';

        if (postComments.length === 0) {
            return '<p style="color: #999; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 8px;">No comments yet. Be the first to comment!</p>';
        }

        return postComments.map((comment, index) => `
            <div style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e0e0e0; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #333; font-size: 15px; font-family: Raleway;">${escapeHtml(comment.name)}</strong>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #999; font-size: 12px;">${formatCommentDate(comment.date)}</span>
                        ${isAdmin ? `
                            <button onclick="deleteComment('${postId}', ${index})"
                                    style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                    title="Delete comment">
                                ✕
                            </button>
                        ` : ''}
                    </div>
                </div>
                <p style="color: #444; line-height: 1.6; margin: 0; font-family: Raleway;">${escapeHtml(comment.text)}</p>
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
    window.expandPost = async function(postId) {
        let post = loadedJournals.find(j => j.id === postId);
        if (!post) return;

        // If post has a file property, load full content from JSON
        if (post.file && !post.content) {
            try {
                const response = await fetch(post.file);
                if (response.ok) {
                    const fullPost = await response.json();
                    post = { ...post, ...fullPost };
                    // Update in loadedJournals for future use
                    const index = loadedJournals.findIndex(j => j.id === postId);
                    if (index !== -1) {
                        loadedJournals[index] = post;
                    }
                }
            } catch (error) {
                console.error('Could not load full post data:', error);
            }
        }

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

        // Add new comment at the beginning (newest first)
        allComments[postId].unshift({
            name: name,
            text: text,
            date: new Date().toISOString()
        });

        saveComments(allComments);

        // Clear inputs and refresh display
        nameInput.value = '';
        textInput.value = '';

        // Refresh the comments display
        const commentsContainer = document.getElementById(`comments-${postId}`);
        if (commentsContainer) {
            commentsContainer.innerHTML = getComments(postId);
        }

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 10px;';
        successMsg.textContent = 'Comment posted successfully!';
        commentsContainer.parentNode.insertBefore(successMsg, commentsContainer);
        setTimeout(() => successMsg.remove(), 3000);
    };

    // Delete a comment (admin only)
    window.deleteComment = function(postId, commentIndex) {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        const allComments = getAllComments();
        if (allComments[postId] && allComments[postId][commentIndex]) {
            allComments[postId].splice(commentIndex, 1);
            saveComments(allComments);

            // Refresh the comments display
            const commentsContainer = document.getElementById(`comments-${postId}`);
            if (commentsContainer) {
                commentsContainer.innerHTML = getComments(postId);
            }
        }
    };

    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatContent(content) {
        // Convert markdown-style headers and formatting to HTML
        let formatted = content;

        // Process markdown links - use placeholder to protect from escaping
        const linkPlaceholders = [];
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
            const placeholder = `__LINK_PLACEHOLDER_${linkPlaceholders.length}__`;
            linkPlaceholders.push(`<a href="${escapeHtml(url)}" target="_blank" style="color: #0066cc; text-decoration: none;">${escapeHtml(text)}</a>`);
            return placeholder;
        });

        // Escape HTML
        formatted = escapeHtml(formatted);

        // Process other markdown elements
        formatted = formatted
            .replace(/^### (.*?)$/gm, '<h4>$1</h4>')
            .replace(/^## (.*?)$/gm, '<h3>$1</h3>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')  // Bold text
            .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');  // Italic text

        // Restore links from placeholders
        linkPlaceholders.forEach((link, index) => {
            formatted = formatted.replace(`__LINK_PLACEHOLDER_${index}__`, link);
        });

        // Process paragraphs and line breaks
        formatted = formatted
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