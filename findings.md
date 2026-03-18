# Smart Tab Manager - Findings & Research

## 🔍 Current Project State
- Fresh repository with minimal setup
- No existing code yet
- README.md is minimal

## 📚 Chrome Extension API Research

### Manifest V3 (Latest Standard)
- All new extensions must use Manifest V3
- Service workers replace background pages
- Content security policy restrictions apply

### Key APIs Needed
1. **chrome.tabs**: Query, activate, remove, update tabs
   - `chrome.tabs.query()` - list all tabs
   - `chrome.tabs.onActivated` - track tab activation
   - `chrome.tabs.remove()` - close tabs
   - `chrome.tabs.update()` - update tab properties

2. **chrome.storage.local**: Persistent key-value storage
   - Survives browser restarts
   - Per-extension storage
   - ~10MB limit per extension

3. **chrome.alarms**: Schedule background tasks
   - Minimum 1 minute interval
   - Survives service worker termination

4. **chrome.runtime**: Extension lifecycle
   - `chrome.runtime.onInstalled` - first run setup
   - Message passing between components

5. **chrome.webNavigation** (optional): Track page navigation
   - More precise tracking than onActivated alone

## 🎨 UI/UX Considerations
- Popup size typically 400x600px (configurable)
- Need responsive layout for many tabs
- Virtual scrolling might be needed for 100+ tabs
- Clear visual distinction for inactive/active tabs
- Icon/favicon display requires URL-to-favicon conversion

## 💾 Storage Strategy
```json
{
  "tabTracking": {
    "tabId": {
      "url": "string",
      "title": "string",
      "lastAccessed": "timestamp",
      "isArchived": "boolean"
    }
  },
  "settings": {
    "inactiveThresholdDays": 3,
    "autoCleanupEnabled": false,
    "requireConfirmation": true
  }
}
```

## 🔧 Technical Challenges Identified
1. **Tab ID Reuse**: Chrome reuses tab IDs after tabs close - need timestamp-based tracking
2. **URL Privacy**: Cannot fully access URL for sandboxed tabs
3. **Content Script Permissions**: May need extra permissions for preview feature
4. **Service Worker Lifetime**: Must handle termination and recovery
5. **Duplicate Detection**: URL normalization needed (trailing slashes, query params, etc.)

## ⚠️ Known Limitations
- Cannot access tabs in other windows directly (popup only shows current window)
- Cannot run arbitrary JS on certain special pages (chrome://, edge://, etc.)
- chrome.alarms requires background permission

## 📌 MVP Strategy
1. Start with Phase 1-4 for solid MVP
2. Phase 5-6 add value immediately
3. Phase 7 (preview) can be deferred if needed
4. Phase 8 is nice-to-have for v2

---

**Last Updated**: Session start
**Status**: Research complete, ready for planning decisions
