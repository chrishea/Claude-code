// Newspaper Distribution Tracker App
// The Monthly - Killer Craft Village, NM

(function() {
    'use strict';

    // Storage key for local backup
    const STORAGE_KEY = 'monthlyDistributions';

    // Check if cloud database is enabled
    function useCloud() {
        return window.CONFIG && window.CONFIG.USE_CLOUD_DATABASE && window.CONFIG.API_URL;
    }

    // DOM Elements
    const elements = {
        form: document.getElementById('distribution-form'),
        locationInput: document.getElementById('location'),
        dateInput: document.getElementById('date'),
        copiesInput: document.getElementById('copies'),
        delivererInput: document.getElementById('deliverer'),
        notesInput: document.getElementById('notes'),
        successMessage: document.getElementById('success-message'),
        historyList: document.getElementById('history-list'),
        filterMonth: document.getElementById('filter-month'),
        clearFilter: document.getElementById('clear-filter'),
        totalEntries: document.getElementById('total-entries'),
        totalCopies: document.getElementById('total-copies'),
        exportCsv: document.getElementById('export-csv'),
        exportJson: document.getElementById('export-json'),
        importFile: document.getElementById('import-file'),
        clearData: document.getElementById('clear-data'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        deleteModal: document.getElementById('delete-modal'),
        cancelDelete: document.getElementById('cancel-delete'),
        confirmDelete: document.getElementById('confirm-delete'),
        clearModal: document.getElementById('clear-modal'),
        cancelClear: document.getElementById('cancel-clear'),
        confirmClear: document.getElementById('confirm-clear')
    };

    // State
    let distributions = [];
    let deleteTargetId = null;
    let isLoading = false;

    // Initialize the app
    async function init() {
        await loadData();
        setDefaultDate();
        setupEventListeners();
        renderHistory();
        registerServiceWorker();
    }

    // API call helper
    async function apiCall(action, options = {}) {
        if (!useCloud()) {
            throw new Error('Cloud database not configured');
        }

        const url = new URL(window.CONFIG.API_URL);
        url.searchParams.set('action', action);

        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.set(key, value);
            });
        }

        const fetchOptions = {
            method: options.method || 'GET',
            mode: 'cors'
        };

        if (options.body) {
            fetchOptions.method = 'POST';
            fetchOptions.body = JSON.stringify(options.body);
            fetchOptions.headers = {
                'Content-Type': 'application/json'
            };
        }

        const response = await fetch(url.toString(), fetchOptions);
        return await response.json();
    }

    // Load data from cloud or localStorage
    async function loadData() {
        if (useCloud()) {
            try {
                showLoading(true);
                const result = await apiCall('getAll');
                if (result.entries) {
                    distributions = result.entries;
                    // Also save to localStorage as backup
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(distributions));
                }
            } catch (e) {
                console.error('Error loading from cloud:', e);
                // Fall back to localStorage
                loadFromLocalStorage();
                alert('Could not connect to cloud database. Using local data.');
            } finally {
                showLoading(false);
            }
        } else {
            loadFromLocalStorage();
        }
    }

    // Load from localStorage
    function loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            distributions = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading data:', e);
            distributions = [];
        }
    }

    // Save data to cloud and localStorage
    async function saveData() {
        // Always save to localStorage as backup
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(distributions));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    // Add entry to cloud
    async function addEntryToCloud(entry) {
        if (useCloud()) {
            try {
                await apiCall('add', { body: entry });
            } catch (e) {
                console.error('Error saving to cloud:', e);
                alert('Entry saved locally but could not sync to cloud.');
            }
        }
    }

    // Delete entry from cloud
    async function deleteEntryFromCloud(id) {
        if (useCloud()) {
            try {
                await apiCall('delete', { params: { id } });
            } catch (e) {
                console.error('Error deleting from cloud:', e);
                alert('Entry deleted locally but could not sync to cloud.');
            }
        }
    }

    // Clear all entries from cloud
    async function clearAllFromCloud() {
        if (useCloud()) {
            try {
                await apiCall('clear');
            } catch (e) {
                console.error('Error clearing cloud data:', e);
                alert('Data cleared locally but could not sync to cloud.');
            }
        }
    }

    // Show/hide loading state
    function showLoading(show) {
        isLoading = show;
        if (elements.historyList) {
            if (show) {
                elements.historyList.innerHTML = '<p class="empty-state">Loading...</p>';
            }
        }
    }

    // Set default date to today
    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        elements.dateInput.value = today;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Form submission
        elements.form.addEventListener('submit', handleFormSubmit);

        // Tab navigation
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Filter controls
        elements.filterMonth.addEventListener('change', renderHistory);
        elements.clearFilter.addEventListener('click', () => {
            elements.filterMonth.value = '';
            renderHistory();
        });

        // Export buttons
        elements.exportCsv.addEventListener('click', exportToCsv);
        elements.exportJson.addEventListener('click', exportToJson);
        elements.importFile.addEventListener('change', handleImport);

        // Clear data
        elements.clearData.addEventListener('click', () => {
            elements.clearModal.classList.remove('hidden');
        });
        elements.cancelClear.addEventListener('click', () => {
            elements.clearModal.classList.add('hidden');
        });
        elements.confirmClear.addEventListener('click', async () => {
            distributions = [];
            saveData();
            await clearAllFromCloud();
            renderHistory();
            elements.clearModal.classList.add('hidden');
        });

        // Delete modal
        elements.cancelDelete.addEventListener('click', () => {
            elements.deleteModal.classList.add('hidden');
            deleteTargetId = null;
        });
        elements.confirmDelete.addEventListener('click', async () => {
            if (deleteTargetId) {
                await deleteEntry(deleteTargetId);
            }
            elements.deleteModal.classList.add('hidden');
            deleteTargetId = null;
        });

        // Remember last deliverer name
        elements.delivererInput.addEventListener('blur', () => {
            if (elements.delivererInput.value) {
                localStorage.setItem('lastDeliverer', elements.delivererInput.value);
            }
        });

        // Auto-fill last deliverer on focus if empty
        elements.delivererInput.addEventListener('focus', () => {
            if (!elements.delivererInput.value) {
                const lastDeliverer = localStorage.getItem('lastDeliverer');
                if (lastDeliverer) {
                    elements.delivererInput.value = lastDeliverer;
                }
            }
        });
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();

        const entry = {
            id: generateId(),
            location: elements.locationInput.value.trim(),
            date: elements.dateInput.value,
            copies: parseInt(elements.copiesInput.value, 10),
            deliverer: elements.delivererInput.value.trim(),
            notes: elements.notesInput.value.trim(),
            createdAt: new Date().toISOString()
        };

        distributions.unshift(entry);
        saveData();
        await addEntryToCloud(entry);

        // Show success message
        elements.successMessage.classList.remove('hidden');
        setTimeout(() => {
            elements.successMessage.classList.add('hidden');
        }, 2500);

        // Reset form (keep date and deliverer)
        const currentDeliverer = elements.delivererInput.value;
        elements.locationInput.value = '';
        elements.copiesInput.value = '';
        elements.notesInput.value = '';
        elements.delivererInput.value = currentDeliverer;
        elements.locationInput.focus();

        renderHistory();
    }

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // Switch tabs
    function switchTab(tabId) {
        elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        if (tabId === 'history') {
            renderHistory();
        }
    }

    // Render history list
    function renderHistory() {
        if (isLoading) return;

        const filterValue = elements.filterMonth.value;
        let filtered = distributions;

        if (filterValue) {
            filtered = distributions.filter(d => d.date.startsWith(filterValue));
        }

        // Update stats
        elements.totalEntries.textContent = filtered.length;
        elements.totalCopies.textContent = filtered.reduce((sum, d) => sum + d.copies, 0).toLocaleString();

        if (filtered.length === 0) {
            elements.historyList.innerHTML = '<p class="empty-state">No distributions recorded yet.</p>';
            return;
        }

        elements.historyList.innerHTML = filtered.map(entry => `
            <div class="history-item" data-id="${entry.id}">
                <div class="history-item-header">
                    <span class="history-item-location">${escapeHtml(entry.location)}</span>
                    <span class="history-item-copies">${entry.copies} copies</span>
                </div>
                <div class="history-item-details">
                    <span>📅 ${formatDate(entry.date)}</span>
                    <span>👤 ${escapeHtml(entry.deliverer)}</span>
                </div>
                ${entry.notes ? `<div class="history-item-notes">"${escapeHtml(entry.notes)}"</div>` : ''}
                <div class="history-item-actions">
                    <button class="delete-btn" onclick="app.showDeleteModal('${entry.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Show delete confirmation modal
    function showDeleteModal(id) {
        deleteTargetId = id;
        elements.deleteModal.classList.remove('hidden');
    }

    // Delete entry
    async function deleteEntry(id) {
        distributions = distributions.filter(d => d.id !== id);
        saveData();
        await deleteEntryFromCloud(id);
        renderHistory();
    }

    // Export to CSV
    function exportToCsv() {
        if (distributions.length === 0) {
            alert('No data to export.');
            return;
        }

        const headers = ['Date', 'Location', 'Copies', 'Delivered By', 'Notes'];
        const rows = distributions.map(d => [
            d.date,
            `"${d.location.replace(/"/g, '""')}"`,
            d.copies,
            `"${d.deliverer.replace(/"/g, '""')}"`,
            `"${(d.notes || '').replace(/"/g, '""')}"`
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadFile(csv, `monthly-distributions-${getDateStamp()}.csv`, 'text/csv');
    }

    // Export to JSON
    function exportToJson() {
        if (distributions.length === 0) {
            alert('No data to export.');
            return;
        }

        const json = JSON.stringify(distributions, null, 2);
        downloadFile(json, `monthly-distributions-${getDateStamp()}.json`, 'application/json');
    }

    // Handle import
    async function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error('Invalid format');
                }

                // Validate structure
                const valid = imported.every(item =>
                    item.location && item.date && typeof item.copies === 'number' && item.deliverer
                );

                if (!valid) {
                    throw new Error('Invalid data structure');
                }

                // Merge with existing (avoid duplicates by id)
                const existingIds = new Set(distributions.map(d => d.id));
                const newEntries = imported.filter(item => !existingIds.has(item.id));

                if (newEntries.length === 0) {
                    alert('All entries already exist. No new data imported.');
                    return;
                }

                // Add new entries
                for (const entry of newEntries) {
                    distributions.push(entry);
                    await addEntryToCloud(entry);
                }

                distributions.sort((a, b) => new Date(b.date) - new Date(a.date));
                saveData();
                renderHistory();

                alert(`Successfully imported ${newEntries.length} entries!`);
            } catch (err) {
                alert('Error importing file. Please ensure it\'s a valid JSON backup file.');
                console.error('Import error:', err);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    }

    // Download file helper
    function downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get date stamp for filenames
    function getDateStamp() {
        return new Date().toISOString().split('T')[0];
    }

    // Format date for display
    function formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Register service worker
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }

    // Expose functions for inline event handlers
    window.app = {
        showDeleteModal
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
