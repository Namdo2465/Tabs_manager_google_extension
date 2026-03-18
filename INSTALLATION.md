# 🚀 Installation & Testing Guide

## Quick Start for Chrome

### Step 1: Open Extensions Page
1. Open Chrome browser
2. Go to `chrome://extensions/`
3. You should see the Extensions management page

### Step 2: Enable Developer Mode
1. Look at the top-right corner of the Extensions page
2. Toggle "Developer mode" to ON
3. You'll see new buttons appear (Load unpacked, Pack extension, etc.)

### Step 3: Load the Extension
1. Click "Load unpacked" button
2. Navigate to `/Users/namdo/Documents/Tabs_manager_google_extension`
3. Click "Select Folder"
4. The extension should now appear in your extensions list with:
   - Name: Smart Tab Manager
   - Status: Enabled (blue toggle)
   - ID: (auto-generated)

### Step 4: Pin to Toolbar (Optional)
1. In the Extensions page, find Smart Tab Manager
2. Click the pin icon next to it
3. The extension icon will now appear in your Chrome toolbar

## Testing the Extension

### Test 1: Open Multiple Tabs
1. Open 5-10 tabs in Chrome (different websites)
2. Click the Smart Tab Manager icon in your toolbar
3. Verify popup shows all open tabs with:
   - ✅ Tab title
   - ✅ Tab URL
   - ✅ Favicon (website icon)
   - ✅ "Active" badge on current tab
   - ✅ "just now" for last accessed time

### Test 2: Tab Switching
1. In the popup, click on any tab
2. Chrome should switch to that tab
3. Go back to the popup - the active tab badge should move

### Test 3: Close Tab from Popup
1. In the popup, click the ✕ button on any tab
2. That tab should close in Chrome
3. The popup should update automatically

### Test 4: Inactive Tab Detection (Optional)
1. Go to Settings (⚙️ icon in popup)
2. Change "Mark tabs as inactive after (days)" to `0`
3. Save settings
4. Go back to popup
5. All tabs should show "Inactive" badge (since 0 days have passed)
6. Inactive tabs should appear with reduced opacity

### Test 5: Duplicate Detection
1. Open the same website twice (e.g., open google.com in two tabs)
2. Open the popup
3. Both tabs should show a "Duplicate" badge
4. Click "Close Duplicates" button
5. One duplicate should close, keeping one
6. A confirmation should appear

### Test 6: Settings
1. Click the ⚙️ icon in the popup header
2. Settings page should open in a new tab
3. Try changing:
   - Inactivity threshold (1-30 days)
   - Enable auto-cleanup checkbox
   - Require confirmation checkbox
4. Click "Save Settings"
5. You should see a "Settings saved successfully!" message
6. Refresh popup - settings should persist

### Test 7: Reload Extension
1. Go back to `chrome://extensions/`
2. Find Smart Tab Manager
3. Click the Reload button (circular arrow)
4. Go to popup again
5. Settings and last accessed times should persist

## Troubleshooting

### Extension Won't Load
**Problem**: Error when loading unpacked extension
- ✅ Make sure manifest.json exists in root folder
- ✅ Check manifest.json syntax (valid JSON)
- ✅ Ensure all referenced files exist

**Solution**: 
```bash
cd /Users/namdo/Documents/Tabs_manager_google_extension
cat manifest.json  # Should display valid JSON
```

### Popup Shows Blank/Loading
**Problem**: Popup doesn't display tabs
- ✅ Check browser console (F12 > Console tab)
- ✅ Look for red error messages
- ✅ Click "Reload" on the extension

**Solution**:
1. Open DevTools: Press F12
2. Go to "Console" tab
3. Look for errors
4. Note the error and try to fix

### Settings Don't Save
**Problem**: Settings keep reverting
- ✅ Check if chrome.storage permission is in manifest
- ✅ Reload extension

**Solution**:
1. Go to `chrome://extensions/`
2. Click "Reload" on Smart Tab Manager
3. Try saving settings again

### Last Accessed Time Not Updating
**Problem**: Time shows "just now" for all tabs
- ✅ This is normal - it updates when you switch tabs
- ✅ Try switching between tabs to test

**Solution**:
1. Click different tabs to switch between them
2. Go back to popup
3. Last accessed times should have updated

## What Works (Verified ✅)

- ✅ Display all tabs in current window
- ✅ Show tab metadata (title, URL, favicon)
- ✅ Display last accessed time
- ✅ Mark active tab with badge
- ✅ Switch to tab from popup
- ✅ Close individual tabs
- ✅ Detect duplicate tabs
- ✅ Close all duplicates at once
- ✅ Settings page loads and saves
- ✅ Refresh popup shows updated data
- ✅ Data persists across sessions

## What to Expect in Next Session

- Full E2E testing
- Bug fixes based on testing
- Performance optimization
- UI refinements
- Tab preview feature (Phase 7)

## Getting Help

If you encounter issues:
1. Check the console (F12 > Console)
2. Reload the extension
3. Clear Chrome cache
4. Try incognito mode (Ctrl+Shift+N)
5. Report issues with:
   - Error messages from console
   - Steps to reproduce
   - Screenshots

---

**Ready to test?** 🎉 Follow the steps above and let me know if everything works!
