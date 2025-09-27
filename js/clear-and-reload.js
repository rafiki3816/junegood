// Clear all localStorage and reload
(function() {
    // Clear all localStorage keys
    console.log('Clearing all localStorage...');
    localStorage.clear();
    sessionStorage.clear();

    // Remove specific keys that might be cached
    const keysToRemove = [
        'junegood_journals',
        'junegood_journals_cache',
        'junegood_comments',
        'junegood_admin_auth',
        'junegood_admin_creds',
        'junegood_auth_setup'
    ];

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed: ${key}`);
    });

    console.log('All storage cleared!');
})();