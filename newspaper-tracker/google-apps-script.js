// ============================================
// Google Apps Script - Paste this into Google Apps Script
// ============================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com and create a new spreadsheet
// 2. Name the first sheet "Distributions"
// 3. Add these headers in row 1: id | location | date | copies | deliverer | notes | createdAt
// 4. Go to Extensions > Apps Script
// 5. Delete any code there and paste this entire file
// 6. Click Deploy > New deployment
// 7. Select type: "Web app"
// 8. Set "Execute as" to "Me"
// 9. Set "Who has access" to "Anyone"
// 10. Click Deploy and copy the Web App URL
// 11. Paste that URL into config.js in your app
//
// ============================================

const SHEET_NAME = 'Distributions';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Enable CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const action = e.parameter.action;

    let result;
    switch (action) {
      case 'getAll':
        result = getAllEntries();
        break;
      case 'add':
        const data = JSON.parse(e.postData.contents);
        result = addEntry(data);
        break;
      case 'delete':
        const deleteId = e.parameter.id;
        result = deleteEntry(deleteId);
        break;
      case 'clear':
        result = clearAllEntries();
        break;
      default:
        result = { error: 'Unknown action' };
    }

    output.setContent(JSON.stringify(result));
  } catch (error) {
    output.setContent(JSON.stringify({ error: error.toString() }));
  }

  return output;
}

function getAllEntries() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return { entries: [] };
  }

  const headers = data[0];
  const entries = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) { // Has an ID
      entries.push({
        id: row[0],
        location: row[1],
        date: row[2],
        copies: parseInt(row[3]) || 0,
        deliverer: row[4],
        notes: row[5] || '',
        createdAt: row[6]
      });
    }
  }

  // Sort by date descending
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  return { entries: entries };
}

function addEntry(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  // Generate ID if not provided
  const id = data.id || Utilities.getUuid();
  const createdAt = data.createdAt || new Date().toISOString();

  sheet.appendRow([
    id,
    data.location,
    data.date,
    data.copies,
    data.deliverer,
    data.notes || '',
    createdAt
  ]);

  return {
    success: true,
    entry: {
      id: id,
      location: data.location,
      date: data.date,
      copies: data.copies,
      deliverer: data.deliverer,
      notes: data.notes || '',
      createdAt: createdAt
    }
  };
}

function deleteEntry(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }

  return { success: false, error: 'Entry not found' };
}

function clearAllEntries() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  return { success: true };
}

// Test function - run this to verify your sheet is set up correctly
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('ERROR: Sheet named "Distributions" not found. Please create it.');
    return;
  }

  const headers = sheet.getRange(1, 1, 1, 7).getValues()[0];
  Logger.log('Headers found: ' + headers.join(', '));
  Logger.log('Setup looks good! You can now deploy the web app.');
}
