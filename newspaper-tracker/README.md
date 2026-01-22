# The Monthly - Distribution Tracker

A simple Progressive Web App (PWA) for tracking newspaper distribution for **The Monthly** newspaper in Killer Craft Village, New Mexico.

## Features

- **Easy Data Entry**: Quickly record distribution drops with location, date, number of copies, and deliverer name
- **History Tracking**: View all past distributions with filtering by month
- **Statistics**: See total entries and copies distributed at a glance
- **Offline Support**: Works without internet connection
- **Export/Import**: Export data as CSV or JSON, import backups
- **iPhone Compatible**: Install directly from Safari - no App Store needed
- **Auto-suggestions**: Remembers locations and names for faster entry
- **Dark Mode**: Automatically adapts to system preferences

## Installation on iPhone

1. Open Safari and navigate to the app URL
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "The Monthly" and tap **Add**
5. The app icon will appear on your home screen

## Deployment

### Option 1: GitHub Pages (Free)

1. Push this folder to a GitHub repository
2. Go to Settings → Pages
3. Set source to your main branch
4. Your app will be available at `https://yourusername.github.io/repo-name/newspaper-tracker/`

### Option 2: Any Web Server

Simply upload the `newspaper-tracker` folder to any web hosting service:
- Netlify (free)
- Vercel (free)
- Your own web server

**Important**: The app must be served over HTTPS for the service worker to function.

## Generating App Icons

1. Open `icons/generate-icons.html` in a web browser
2. Click "Download" for each icon size
3. Save all icons to the `icons/` folder

## Data Storage

All data is stored locally on the device using localStorage. Data persists between sessions and survives app restarts.

**Backup Recommendation**: Regularly export your data using the Export feature to prevent data loss.

## Files

```
newspaper-tracker/
├── index.html      # Main app page
├── styles.css      # App styling
├── app.js          # App functionality
├── manifest.json   # PWA configuration
├── sw.js           # Service worker for offline
├── README.md       # This file
└── icons/
    ├── icon.svg           # Source icon
    └── generate-icons.html # Icon generator tool
```

## Usage

### Recording a Distribution

1. Open the app
2. Enter the location name (e.g., "General Store")
3. Select the date (defaults to today)
4. Enter the number of copies dropped off
5. Enter your name (remembered for next time)
6. Add optional notes
7. Tap "Record Distribution"

### Viewing History

1. Tap the "History" tab
2. Use the month filter to view specific periods
3. Delete individual entries if needed

### Exporting Data

1. Tap the "Export" tab
2. Choose CSV (for spreadsheets) or JSON (for backup)
3. The file will download to your device

### Importing Data

1. Tap the "Export" tab
2. Tap "Import JSON Backup"
3. Select a previously exported JSON file
4. New entries will be merged with existing data

## Browser Support

- Safari (iOS 11.3+)
- Chrome (Android/Desktop)
- Firefox
- Edge

---

Made for The Monthly • Killer Craft Village, NM
