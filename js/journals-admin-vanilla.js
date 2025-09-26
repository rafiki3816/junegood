// Journals Admin CRUD System - Vanilla JavaScript Version
document.addEventListener('DOMContentLoaded', function() {
    // LocalStorage key
    const STORAGE_KEY = 'junegood_journals';

    // Get posts from localStorage
    function getPosts() {
        const posts = localStorage.getItem(STORAGE_KEY);
        return posts ? JSON.parse(posts) : [];
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

    // Load posts in table
    function loadPosts() {
        const posts = getPosts();
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
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${formatDate(post.date)}</td>
                <td><span class="status-badge ${statusClass}">${post.status}</span></td>
                <td>
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
    function showEditor(post = null) {
        document.getElementById('postsList').style.display = 'none';
        document.getElementById('postEditor').style.display = 'block';

        if (post) {
            document.getElementById('editorTitle').textContent = 'Edit Post';
            document.getElementById('postId').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postCategory').value = post.category;
            document.getElementById('postDate').value = post.date;
            document.getElementById('postStatus').value = post.status;
            document.getElementById('postExcerpt').value = post.excerpt;
            document.getElementById('postContent').value = post.content;
            document.getElementById('postTags').value = post.tags;
            document.getElementById('postImage').value = post.image;
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
            document.getElementById('fileName').textContent = 'No file selected';
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
    function savePost(status = 'draft') {
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
            updated: new Date().toISOString()
        };

        if (!postData.title || !postData.category || !postData.date) {
            alert('Please fill in all required fields (Title, Category, Date)');
            return;
        }

        let posts = getPosts();

        if (postId) {
            // Update existing post
            posts = posts.map(p => p.id === postId ? postData : p);
        } else {
            // Add new post
            posts.push(postData);
        }

        savePosts(posts);
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
    function previewPost(id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);

        if (post) {
            const html = convertMarkdownToHtml(post.content);
            const previewContent = document.getElementById('previewContent');
            previewContent.innerHTML = `
                <h1>${post.title}</h1>
                <p style="color: #666; margin-bottom: 20px;">
                    ${post.category} • ${formatDate(post.date)}
                </p>
                ${post.image ? `<img src="${post.image}" style="width: 100%; margin-bottom: 20px; border-radius: 8px;">` : ''}
                <div>${html}</div>
                ${post.tags ? `<p style="margin-top: 30px;"><strong>Tags:</strong> ${post.tags}</p>` : ''}
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
    document.getElementById('newPostBtn').addEventListener('click', function() {
        showEditor();
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        if (confirm('Are you sure? Any unsaved changes will be lost.')) {
            hideEditor();
        }
    });

    document.getElementById('saveBtn').addEventListener('click', function() {
        savePost('draft');
    });

    document.getElementById('publishBtn').addEventListener('click', function() {
        savePost('published');
    });

    // Event delegation for dynamic buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const posts = getPosts();
            const post = posts.find(p => p.id === id);
            showEditor(post);
        }

        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deletePost(id);
        }

        if (e.target.classList.contains('preview-btn')) {
            const id = e.target.dataset.id;
            previewPost(id);
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

    // Export/Import functions
    window.exportPosts = function() {
        const posts = getPosts();
        const dataStr = JSON.stringify(posts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `journals_backup_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    window.importPosts = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = event => {
                try {
                    const posts = JSON.parse(event.target.result);
                    if (confirm('This will replace all existing posts. Continue?')) {
                        savePosts(posts);
                        loadPosts();
                        alert('Posts imported successfully!');
                    }
                } catch (error) {
                    alert('Invalid JSON file');
                }
            };

            reader.readAsText(file);
        };

        input.click();
    };

    // Initialize
    loadPosts();

    // Add export/import buttons to header
    const adminNav = document.querySelector('.admin-nav');
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.textContent = '📥 Export';
    exportBtn.onclick = exportPosts;

    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-secondary';
    importBtn.textContent = '📤 Import';
    importBtn.onclick = importPosts;

    adminNav.appendChild(exportBtn);
    adminNav.appendChild(importBtn);
});