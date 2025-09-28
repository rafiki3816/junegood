// Journals Admin CRUD System - Vanilla JavaScript Version
document.addEventListener('DOMContentLoaded', function() {
    // LocalStorage key
    const STORAGE_KEY = 'junegood_journals';

    // Get posts from localStorage and JSON files
    async function getPosts() {
        // Get localStorage posts
        const localPosts = localStorage.getItem(STORAGE_KEY);
        const storedPosts = localPosts ? JSON.parse(localPosts) : [];

        // Get JSON file posts
        try {
            const response = await fetch('/data/journals-index.json');
            if (response.ok) {
                const data = await response.json();
                const jsonPosts = data.journals || [];

                // Merge posts (avoid duplicates based on ID)
                const allPosts = [...storedPosts];
                jsonPosts.forEach(jsonPost => {
                    if (!allPosts.find(p => p.id === jsonPost.id)) {
                        allPosts.push(jsonPost);
                    }
                });

                return allPosts;
            }
        } catch (error) {
            console.log('Could not load JSON journals:', error);
        }

        return storedPosts;
    }

    // Save posts to localStorage
    function savePosts(posts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Format category display
    function formatCategory(category) {
        if (category === 'life') return 'Ritual life';
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Load posts in table
    async function loadPosts() {
        const posts = await getPosts();
        const tbody = document.getElementById('postsTableBody');
        tbody.innerHTML = '';

        if (posts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                        No posts yet. Click "New Post" to create your first journal entry.
                    </td>
                </tr>
            `;
            return;
        }

        posts.forEach(post => {
            const statusClass = post.status === 'published' ? 'status-published' : 'status-draft';
            const row = document.createElement('tr');
            row.dataset.id = post.id;
            row.innerHTML = `
                <td data-label="Title">${post.title}</td>
                <td data-label="Category">${formatCategory(post.category)}</td>
                <td data-label="Date">${formatDate(post.date)}</td>
                <td data-label="Status"><span class="status-badge ${statusClass}">${post.status}</span></td>
                <td data-label="Actions">
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${post.id}">Edit</button>
                        <button class="btn btn-sm btn-secondary preview-btn" data-id="${post.id}">Preview</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${post.id}">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Show editor
    async function showEditor(post = null) {
        document.getElementById('postsList').style.display = 'none';
        document.getElementById('postEditor').style.display = 'block';

        if (post) {
            // If post has a file property, load content from JSON file
            if (post.file && !post.content) {
                try {
                    const response = await fetch(post.file);
                    if (response.ok) {
                        const fullPost = await response.json();
                        post = { ...post, ...fullPost };
                    }
                } catch (error) {
                    console.error('Could not load full post data:', error);
                }
            }

            document.getElementById('editorTitle').textContent = 'Edit Post';
            document.getElementById('postId').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postCategory').value = post.category;
            document.getElementById('postDate').value = post.date;
            document.getElementById('postStatus').value = post.status;
            document.getElementById('postExcerpt').value = post.excerpt || '';
            document.getElementById('postContent').value = post.content || '';
            document.getElementById('postTags').value = post.tags || '';
            document.getElementById('postImage').value = post.image || '';
            document.getElementById('postReferenceUrl').value = post.referenceUrl || '';
            if (post.image) {
                document.getElementById('fileName').textContent = 'Image loaded';
                updateImagePreview(post.image);
            }
        } else {
            document.getElementById('editorTitle').textContent = 'New Post';
            document.getElementById('postForm').reset();
            document.getElementById('postId').value = '';
            document.getElementById('postDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('removeImageBtn').style.display = 'none';
            document.getElementById('fileName').textContent = 'No image selected (optional)';
            document.getElementById('postImage').value = '';
        }
    }

    // Hide editor
    function hideEditor() {
        document.getElementById('postEditor').style.display = 'none';
        document.getElementById('postsList').style.display = 'block';
        loadPosts();
    }

    // Save post
    async function savePost(status = 'draft') {
        const postId = document.getElementById('postId').value;
        const postData = {
            id: postId || generateId(),
            title: document.getElementById('postTitle').value,
            category: document.getElementById('postCategory').value,
            date: document.getElementById('postDate').value,
            status: status,
            excerpt: document.getElementById('postExcerpt').value,
            content: document.getElementById('postContent').value,
            tags: document.getElementById('postTags').value,
            image: document.getElementById('postImage').value,
            referenceUrl: document.getElementById('postReferenceUrl').value,
            updated: new Date().toISOString()
        };

        if (!postData.title || !postData.category || !postData.date) {
            alert('Please fill in all required fields (Title, Category, Date)');
            return;
        }

        // Check if this is a JSON-based journal
        const posts = await getPosts();
        const existingPost = posts.find(p => p.id === postId);

        if (existingPost && existingPost.file) {
            // This is a JSON-based journal - save to file
            const fileName = existingPost.file.replace('/data/journals/', '');
            alert(`Note: "${postData.title}" is a file-based journal. To fully update it, you need to modify the JSON file: ${fileName}\n\nChanges are temporarily saved in browser storage.`);
        }

        // Save to localStorage (for both new and existing posts)
        let localPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        if (postId) {
            // Check if it's already in localStorage
            const localIndex = localPosts.findIndex(p => p.id === postId);
            if (localIndex !== -1) {
                localPosts[localIndex] = postData;
            } else {
                // Add to localStorage even if it's from JSON file
                localPosts.push(postData);
            }
        } else {
            // Add new post
            localPosts.push(postData);
        }

        savePosts(localPosts);
        hideEditor();
        alert(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`);
    }

    // Delete post
    function deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            let posts = getPosts();
            posts = posts.filter(p => p.id !== id);
            savePosts(posts);
            loadPosts();
            alert('Post deleted successfully!');
        }
    }

    // Preview post
    function previewPost(post) {
        if (post) {
            const html = convertMarkdownToHtml(post.content || '');
            const previewContent = document.getElementById('previewContent');
            previewContent.innerHTML = `
                <h1>${post.title}</h1>
                <p style="color: #666; margin-bottom: 20px;">
                    ${formatCategory(post.category)} • ${formatDate(post.date)}
                </p>
                ${post.image ? `<img src="${post.image}" style="width: 100%; margin-bottom: 20px; border-radius: 8px;">` : ''}
                <div>${html}</div>
                ${post.tags ? `<p style="margin-top: 30px;"><strong>Tags:</strong> ${post.tags}</p>` : ''}
                ${post.referenceUrl ? `<p style="margin-top: 20px;"><strong>Reference:</strong> <a href="${post.referenceUrl}" target="_blank" style="color: #0066cc;">${post.referenceUrl}</a></p>` : ''}
            `;
            document.getElementById('previewModal').style.display = 'flex';
        }
    }

    // Simple Markdown to HTML converter
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

    // Update image preview
    function updateImagePreview(imageData) {
        const preview = document.getElementById('imagePreview');
        const removeBtn = document.getElementById('removeImageBtn');

        if (imageData) {
            preview.innerHTML = `<img src="${imageData}" alt="Preview">`;
            preview.style.display = 'block';
            removeBtn.style.display = 'inline-block';
        } else {
            preview.style.display = 'none';
            removeBtn.style.display = 'none';
        }
    }

    // Convert image to base64
    function convertImageToBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Event handlers
    document.getElementById('newPostBtn').addEventListener('click', async function() {
        await showEditor();
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        if (confirm('Are you sure? Any unsaved changes will be lost.')) {
            hideEditor();
        }
    });

    document.getElementById('saveBtn').addEventListener('click', async function() {
        await savePost('draft');
    });

    document.getElementById('publishBtn').addEventListener('click', async function() {
        await savePost('published');
    });

    // Event delegation for dynamic buttons
    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const posts = await getPosts();
            const post = posts.find(p => p.id === id);
            await showEditor(post);
        }

        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deletePost(id);
        }

        if (e.target.classList.contains('preview-btn')) {
            const id = e.target.dataset.id;
            const posts = await getPosts();
            const post = posts.find(p => p.id === id);

            if (post) {
                // Load full content if it's a JSON file
                let fullPost = post;
                if (post.file && !post.content) {
                    try {
                        const response = await fetch(post.file);
                        if (response.ok) {
                            const fullData = await response.json();
                            fullPost = { ...post, ...fullData };
                        }
                    } catch (error) {
                        console.error('Could not load full post for preview:', error);
                    }
                }
                previewPost(fullPost);
            }
        }

        if (e.target.classList.contains('close-preview') || e.target.id === 'previewModal') {
            document.getElementById('previewModal').style.display = 'none';
        }
    });

    // Image upload handlers
    document.getElementById('uploadBtn').addEventListener('click', function() {
        document.getElementById('imageUpload').click();
    });

    document.getElementById('imageUpload').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            document.getElementById('fileName').textContent = file.name;

            // Convert to base64 and store
            convertImageToBase64(file, function(base64Data) {
                document.getElementById('postImage').value = base64Data;
                updateImagePreview(base64Data);
            });
        }
    });

    document.getElementById('removeImageBtn').addEventListener('click', function() {
        document.getElementById('postImage').value = '';
        document.getElementById('imageUpload').value = '';
        document.getElementById('fileName').textContent = 'No file selected';
        updateImagePreview(null);
    });

    // Editor toolbar
    document.querySelectorAll('.editor-toolbar button').forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            const textarea = document.getElementById('postContent');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let replacement = '';

            switch(format) {
                case 'bold':
                    replacement = `**${selectedText || 'bold text'}**`;
                    break;
                case 'italic':
                    replacement = `*${selectedText || 'italic text'}*`;
                    break;
                case 'heading2':
                    replacement = `## ${selectedText || 'Heading 2'}`;
                    break;
                case 'heading3':
                    replacement = `### ${selectedText || 'Heading 3'}`;
                    break;
                case 'link':
                    const url = prompt('Enter URL:');
                    if (url) {
                        replacement = `[${selectedText || 'link text'}](${url})`;
                    }
                    break;
                case 'image':
                    const imgUrl = prompt('Enter image URL:');
                    if (imgUrl) {
                        replacement = `![${selectedText || 'alt text'}](${imgUrl})`;
                    }
                    break;
                case 'quote':
                    replacement = `> ${selectedText || 'quote'}`;
                    break;
                case 'list':
                    replacement = `* ${selectedText || 'list item'}`;
                    break;
            }

            if (replacement) {
                textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                textarea.focus();
                textarea.setSelectionRange(start + replacement.length, start + replacement.length);
            }
        });
    });

    // Comments Management
    function loadComments() {
        const COMMENTS_KEY = 'junegood_comments';
        const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
        const posts = getPosts();
        const container = document.getElementById('commentsAdminList');

        if (!container) return;

        let allCommentsArray = [];

        // Flatten all comments with post info
        Object.keys(allComments).forEach(postId => {
            const post = posts.find(p => p.id === postId);
            const postTitle = post ? post.title : 'Unknown Post';

            allComments[postId].forEach(comment => {
                allCommentsArray.push({
                    ...comment,
                    postId: postId,
                    postTitle: postTitle
                });
            });
        });

        // Sort by date (newest first)
        allCommentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (allCommentsArray.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No comments yet.</p>';
            return;
        }

        // Show only recent 10 comments
        const recentComments = allCommentsArray.slice(0, 10);

        container.innerHTML = recentComments.map(comment => `
            <div style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <strong style="color: #333;">${comment.name}</strong>
                        <span style="color: #999; font-size: 12px; margin-left: 10px;">${formatDate(comment.date)}</span>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">
                            On: <a href="#" onclick="event.preventDefault(); viewPost('${comment.postId}')" style="color: #0066cc;">${comment.postTitle}</a>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="deleteComment('${comment.postId}', '${comment.id}')">Delete</button>
                </div>
                <p style="color: #666; margin: 0;">${comment.text}</p>
            </div>
        `).join('');
    }

    // Delete comment function
    window.deleteComment = function(postId, commentId) {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        const COMMENTS_KEY = 'junegood_comments';
        const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');

        if (allComments[postId]) {
            allComments[postId] = allComments[postId].filter(c => c.id !== commentId);

            if (allComments[postId].length === 0) {
                delete allComments[postId];
            }

            localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
            loadComments();
        }
    };

    // View post function
    window.viewPost = function(postId) {
        const post = getPosts().find(p => p.id === postId);
        if (post) {
            showEditor(post);
        }
    };

    // Initialize
    loadPosts();
    loadComments();
});