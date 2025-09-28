// Works loader - Dynamic content loading system
(function() {
    'use strict';

    // Cache for works data
    let worksCache = {
        index: null,
        works: {},
        lastFetch: null
    };

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Load works index
    async function loadWorksIndex() {
        const now = Date.now();

        // Use cache if valid
        if (worksCache.index && worksCache.lastFetch && (now - worksCache.lastFetch < CACHE_DURATION)) {
            return worksCache.index;
        }

        try {
            const response = await fetch('/data/works-index.json');
            if (!response.ok) throw new Error('Failed to load works index');

            const data = await response.json();
            worksCache.index = data.works;
            worksCache.lastFetch = now;

            return data.works;
        } catch (error) {
            console.error('Error loading works index:', error);
            return [];
        }
    }

    // Load individual work content
    async function loadWork(workFile) {
        // Check cache
        if (worksCache.works[workFile]) {
            return worksCache.works[workFile];
        }

        try {
            const response = await fetch(workFile);
            if (!response.ok) throw new Error(`Failed to load work: ${workFile}`);

            const work = await response.json();
            worksCache.works[workFile] = work;

            return work;
        } catch (error) {
            console.error('Error loading work:', error);
            return null;
        }
    }

    // Create work card HTML
    function createWorkCard(work) {
        const techString = work.technologies ? work.technologies.join(' • ') : '';
        const projectLink = work.projectUrl ? `<a href="${work.projectUrl}" target="_blank" rel="noopener" class="project-link">View Project</a>` : '';
        const githubLink = work.githubUrl ? `<a href="${work.githubUrl}" target="_blank" rel="noopener" class="github-link">GitHub</a>` : '';

        return `
            <article class="work-card" data-work-id="${work.id}">
                <div class="work-header">
                    <h2 class="work-title">${work.title}</h2>
                    <div class="work-meta">
                        <span class="work-type">${work.type}</span>
                        <span class="work-date">${formatDate(work.date)}</span>
                    </div>
                </div>
                ${work.image ? `<img src="${work.image}" alt="${work.title}" class="work-image">` : ''}
                <div class="work-content">
                    <p class="work-excerpt">${work.excerpt}</p>
                    ${techString ? `<div class="work-technologies">${techString}</div>` : ''}
                    <div class="work-actions">
                        <button class="read-more-btn" data-work-file="${work.file}">자세히 보기</button>
                        ${projectLink}
                        ${githubLink}
                    </div>
                </div>
            </article>
        `;
    }

    // Display full work content
    function displayWorkContent(work) {
        const modal = document.createElement('div');
        modal.className = 'work-modal';
        modal.innerHTML = `
            <div class="work-modal-content">
                <button class="close-modal">&times;</button>
                <article class="work-full">
                    <header>
                        <h1>${work.title}</h1>
                        <div class="work-details">
                            <span class="work-role">${work.role}</span>
                            <span class="work-date">${formatDate(work.date)}</span>
                        </div>
                    </header>
                    ${work.image ? `<img src="${work.image}" alt="${work.title}" class="work-hero-image">` : ''}
                    <div class="work-body">${convertMarkdownToHtml(work.content)}</div>
                    ${work.projectUrl || work.githubUrl ? `
                        <footer class="work-footer">
                            ${work.projectUrl ? `<a href="${work.projectUrl}" target="_blank" rel="noopener" class="btn-primary">프로젝트 보기</a>` : ''}
                            ${work.githubUrl ? `<a href="${work.githubUrl}" target="_blank" rel="noopener" class="btn-secondary">소스 코드</a>` : ''}
                        </footer>
                    ` : ''}
                </article>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Escape key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Convert markdown to HTML (basic)
    function convertMarkdownToHtml(markdown) {
        if (!markdown) return '';

        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            // Lists
            .replace(/^\* (.+)$/gim, '<li>$1</li>')
            .replace(/^\- (.+)$/gim, '<li>$1</li>')
            .replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            // Line breaks
            .replace(/\n/g, '<br>');

        // Wrap lists
        html = html.replace(/(<li>.*<\/li>)/s, (match) => {
            return '<ul>' + match + '</ul>';
        });

        // Wrap in paragraphs
        if (!html.startsWith('<')) {
            html = '<p>' + html + '</p>';
        }

        return html;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('ko-KR', options);
    }

    // Initialize works display
    async function initWorks() {
        const container = document.getElementById('works-container');
        if (!container) return;

        // Show loading
        container.innerHTML = '<div class="loading">작품 목록을 불러오는 중...</div>';

        try {
            const works = await loadWorksIndex();

            if (works.length === 0) {
                container.innerHTML = '<p class="no-works">등록된 작품이 없습니다.</p>';
                return;
            }

            // Sort by date (newest first)
            works.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Display works
            container.innerHTML = works.map(work => createWorkCard(work)).join('');

            // Add click handlers for "read more" buttons
            container.querySelectorAll('.read-more-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const workFile = e.target.dataset.workFile;
                    const work = await loadWork(workFile);
                    if (work) {
                        displayWorkContent(work);
                    }
                });
            });

        } catch (error) {
            console.error('Error initializing works:', error);
            container.innerHTML = '<p class="error">작품 목록을 불러오는 데 실패했습니다.</p>';
        }
    }

    // Export for global access
    window.WorksLoader = {
        init: initWorks,
        loadWorksIndex,
        loadWork
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorks);
    } else {
        initWorks();
    }

})();