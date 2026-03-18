# Smart Tab Manager Chrome Extension

A powerful Chrome extension that helps you manage large numbers of open tabs efficiently.

## 🎯 Features

### Core Features
- **📊 Tab Dashboard**: See all open tabs at a glance with title, URL, favicon, and last accessed time
- **⏰ Activity Tracking**: Automatically tracks when each tab was last accessed
- **😴 Inactive Tab Detection**: Identifies tabs not accessed for X days (configurable, default 3 days)
- **🎯 Duplicate Detection**: Finds and helps you close duplicate tabs with the same URL
- **🧹 Auto-Cleanup**: Automatically close inactive and duplicate tabs with optional confirmation
- **⚙️ Customizable Settings**: Configure inactivity threshold, enable/disable auto-cleanup, and more

### UI/UX
- Clean, intuitive popup interface
- Visual indicators for active/inactive/duplicate tabs
- Direct tab closing from popup (no need to switch tabs)
- Settings page for configuration
- Real-time stats showing tab counts

## 🚀 Installation

### For Development
1. Clone or download this repository
2. Open `chrome://extensions/` in your Chrome browser
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked" and select the project directory
5. The extension icon should appear in your Chrome toolbar

### Regular Installation
Coming to the Chrome Web Store soon!

## 💻 Usage

### Popup Interface
1. Click the extension icon in your toolbar to open the popup
2. View all open tabs with their status (Active/Inactive/Duplicate)
3. Click any tab to switch to it
4. Use the ✕ button to close individual tabs
5. Use "Close Duplicates" to close all duplicates (keeps 1 per URL)
6. Use "Run Cleanup" to close inactive tabs and duplicates

### Settings
1. Click the ⚙️ icon in the popup header
2. Configure:
   - **Inactivity threshold** (days): How long before a tab is marked inactive
   - **Auto-cleanup**: Enable/disable automatic cleanup
   - **Confirmation**: Whether to ask before cleanup runs
3. Click "Save Settings"

## 🔧 Technical Details

### Project Structure
```
src/
├── popup/                 # Popup UI and logic
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── options/              # Settings page
│   ├── options.html
│   ├── options.css
│   └── options.js
├── background/          # Service worker
│   └── service-worker.js
├── content/            # Content scripts
│   └── content-script.js
└── utils/              # Shared utilities
    ├── storage.js      # chrome.storage helpers
    └── tab-utils.js    # Tab operations
```

### Storage
- Uses `chrome.storage.local` for persistent data
- Stores tab tracking data (last accessed times)
- Stores user settings

### APIs Used
- `chrome.tabs` - Query, activate, remove tabs
- `chrome.storage.local` - Persistent key-value storage
- `chrome.runtime` - Message passing and lifecycle
- `chrome.alarms` - Schedule background tasks
- `chrome.webNavigation` - Track navigation (optional)

## 🐛 Known Issues
- Cannot close tabs on special pages (chrome://, edge://, etc.)
- Tab favicon URLs may not always be available
- Some websites may not allow direct tab switching

## 📈 Future Enhancements
- Tab content preview (snippet of page content)
- Tab grouping by domain
- Tab notes/annotations
- Smart summary with AI integration
- Export tab list
- Tab recovery from recent history

## 📄 License
MIT License - Feel free to use, modify, and distribute

## 🙏 Contributing
Found a bug or have a feature request? Please open an issue or submit a pull request!

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Developed with ❤️**