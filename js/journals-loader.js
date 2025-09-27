// Journal loader - Loads journals from individual files
(function() {
    'use strict';

    const JOURNALS_INDEX_PATH = '/data/journals-index.json';
    const STORAGE_KEY = 'junegood_journals_cache';
    const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes cache

    // Load journals from files
    async function loadJournals() {
        try {
            // Check cache first
            const cached = getCachedJournals();
            if (cached) {
                console.log('Loading journals from cache');
                return cached;
            }

            console.log('Loading journals index from:', JOURNALS_INDEX_PATH);
            // Load index file
            const indexResponse = await fetch(JOURNALS_INDEX_PATH);
            if (!indexResponse.ok) {
                console.error('Failed to load journals index:', indexResponse.status, indexResponse.statusText);
                throw new Error('Failed to load journals index');
            }

            const index = await indexResponse.json();
            const journals = [];

            // Load each journal file
            for (const meta of index.journals) {
                try {
                    if (meta.status === 'published') {
                        console.log(`Loading journal file: ${meta.file}`);
                        const journalResponse = await fetch(meta.file);
                        if (journalResponse.ok) {
                            const journal = await journalResponse.json();
                            journals.push(journal);
                            console.log(`Successfully loaded: ${meta.title}`);
                        } else {
                            console.error(`Failed to fetch journal file: ${meta.file}`, journalResponse.status);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to load journal: ${meta.id}`, error);
                }
            }

            // Cache the loaded journals
            cacheJournals(journals);

            console.log(`Loaded ${journals.length} journals from files`);
            return journals;

        } catch (error) {
            console.error('Error loading journals:', error);
            // Fallback to any existing cached data
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                return data.journals || [];
            }
            return [];
        }
    }

    // Get cached journals if still valid
    function getCachedJournals() {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const now = Date.now();

            if (data.timestamp && (now - data.timestamp) < CACHE_DURATION) {
                return data.journals;
            }
        } catch (error) {
            console.error('Cache read error:', error);
        }
        return null;
    }

    // Cache journals with timestamp
    function cacheJournals(journals) {
        try {
            const data = {
                journals: journals,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Cache write error:', error);
        }
    }

    // Clear cache
    function clearCache() {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Journal cache cleared');
    }

    // Export functions
    window.JournalsLoader = {
        load: loadJournals,
        clearCache: clearCache
    };

    // Auto-load on page ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeJournals);
    } else {
        initializeJournals();
    }

    async function initializeJournals() {
        // Only initialize on the journals page
        if (!window.location.pathname.includes('sub4')) return;

        const journals = await loadJournals();

        // Trigger custom event with loaded journals
        window.dispatchEvent(new CustomEvent('journalsLoaded', {
            detail: { journals: journals }
        }));
    }

})();