// ============================================
// Configuration - Update this after deploying Google Apps Script
// ============================================

const CONFIG = {
    // Paste your Google Apps Script Web App URL here
    // It will look like: https://script.google.com/macros/s/XXXXXXXXXXXX/exec
    API_URL: 'https://docs.google.com/spreadsheets/d/1YJibZSVXBCLWHHBrX7nxC8XHlqyImZYFVNmpM3ws-zY/edit?usp=sharing',

    // Set to true once you've configured the API_URL above
    USE_CLOUD_DATABASE: true
};

// Don't modify below this line
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
