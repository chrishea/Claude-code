# Setup Guide: Shared Cloud Database

This guide will help you set up Google Sheets as a shared database so multiple people can use the distribution tracker and all entries go to one central location.

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Monthly Distribution Data"
4. In the first sheet, rename it to exactly: `Distributions`
5. Add these headers in row 1 (columns A through G):
   - A1: `id`
   - B1: `location`
   - C1: `date`
   - D1: `copies`
   - E1: `deliverer`
   - F1: `notes`
   - G1: `createdAt`

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any code in the editor
3. Copy the entire contents of `google-apps-script.js` from this folder and paste it in
4. Click **Save** (disk icon) and name the project (e.g., "Distribution Tracker API")
5. Click **Run > testSetup** to verify everything is configured correctly
   - You'll need to authorize the script (click through the permissions)
   - Check the execution log - it should say "Setup looks good!"

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon and select **Web app**
3. Configure:
   - Description: "Distribution Tracker API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** - it looks like: `https://script.google.com/macros/s/XXXX.../exec`

## Step 4: Configure the App

1. Open `config.js` in the newspaper-tracker folder
2. Paste your Web App URL:
   ```javascript
   const CONFIG = {
       API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
       USE_CLOUD_DATABASE: true
   };
   ```
3. Save the file

## Step 5: Host the App

To share the app with multiple people, you need to host it somewhere. Here are free options:

### Option A: GitHub Pages (Recommended - Free)

1. Push this folder to a GitHub repository
2. Go to repository Settings > Pages
3. Set source to "main" branch
4. Your app will be available at: `https://yourusername.github.io/repository-name/newspaper-tracker/`

### Option B: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `newspaper-tracker` folder
3. Get your free URL

### Option C: Vercel (Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the newspaper-tracker folder
3. Follow the prompts

## Step 6: Add to iPhone Home Screen

Once hosted, users can add the app to their iPhone home screen:

1. Open the hosted URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Name it "The Monthly"
5. Tap "Add"

The app will now work like a native app on the iPhone!

## Troubleshooting

### "Could not connect to cloud database"
- Check that the Web App URL is correct in `config.js`
- Make sure `USE_CLOUD_DATABASE` is set to `true`
- Verify the Google Apps Script is deployed as a web app with "Anyone" access

### Data not syncing
- Click "Refresh Data" on the report page
- Check the Google Sheet directly to see if data is being added
- Look at the browser console (F12) for error messages

### Script errors
- Go to Apps Script > Executions to see error logs
- Make sure the sheet is named exactly "Distributions"
- Verify headers match exactly (case-sensitive)

## Security Notes

- The Google Sheet is only accessible by you (the owner)
- The web app can be accessed by anyone with the URL
- No authentication is required to submit entries
- Consider keeping the app URL private to your team

## Updating the App

If you need to make changes to the Google Apps Script:

1. Edit the code in Apps Script
2. Click **Deploy > Manage deployments**
3. Click the pencil icon on your deployment
4. Change version to "New version"
5. Click **Deploy**

The URL stays the same, but the new code will be active.
