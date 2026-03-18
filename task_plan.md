# Smart Tab Manager Extension - Task Plan

## 📋 Project Overview
Build a Chrome extension that helps users manage large numbers of open tabs efficiently by providing a dashboard UI, tracking last accessed times, detecting inactive/duplicate tabs, and automating cleanup tasks.

## 🎯 Core Problem
Users often have too many tabs open and cannot see tab titles or manage them easily. The extension should act as a dashboard and automation tool.

## 📊 Implementation Phases

### Phase 1: Foundation & Core Infrastructure
- Set up Chrome extension project structure (manifest v3)
- Create basic popup UI scaffold
- Implement tab query functionality
- Set up chrome.storage.local for data persistence

### Phase 2: Tab Dashboard UI
- Display all tabs with title, URL, favicon, last accessed time
- Show active/inactive status
- Implement close tab action
- Visual highlighting for inactive tabs

### Phase 3: Tab Activity Tracking
- Implement tab activation tracking using chrome.tabs onActivated
- Store last accessed timestamps in chrome.storage.local
- Handle tab updates and reloads
- Handle tab closures correctly
- Persist data across sessions

### Phase 4: Inactive Tab Detection
- Implement logic to mark tabs as inactive (default: 3 days)
- Allow user to configure threshold in settings
- Display inactive tabs clearly in UI with visual indicators

### Phase 5: Duplicate Tab Detection
- Implement duplicate detection by URL matching
- Group duplicate tabs together
- Provide action to close duplicates (keep 1)
- Display in UI

### Phase 6: Auto Cleanup System
- Implement background service worker
- Use chrome.alarms API for periodic cleanup
- Rules: close inactive tabs, close duplicates
- Add settings UI for enable/disable
- Confirmation toggle before cleanup

### Phase 7: Tab Content Preview (Intermediate)
- Extract basic page content (title + snippet)
- Use content scripts if needed
- Display preview in UI

### Phase 8: Smart Summary & Polish (Optional Advanced)
- Generate tab summary
- Group by domain or topic
- Count inactive tabs
- Design for future AI integration

## ✅ Key Decisions (Confirmed)
- [x] **Default inactive threshold**: 3 days (user configurable)
- [x] **Tab removal**: Keep it simple - just close/delete functionality (no archive)
- [x] **Auto-cleanup**: Enable/disable toggle in settings, ask confirmation before cleanup
- [x] **Tab preview**: Defer to v2 - focus on MVP first
- [x] **Priority**: MVP functionality (Phases 1-6), then polish

## 📁 Project Structure (To Be Created)
```
smart-tab-manager/
├── manifest.json
├── src/
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── background/
│   │   └── service-worker.js
│   ├── content/
│   │   └── content-script.js
│   └── utils/
│       ├── storage.js
│       └── tab-utils.js
├── assets/
│   ├── icons/
│   └── styles/
└── README.md
```

## 🚀 Success Criteria
- [ ] Extension loads in Chrome without errors
- [ ] Tab dashboard displays all tabs
- [ ] Last accessed times tracked and displayed
- [ ] Inactive tabs identified and highlighted
- [ ] Users can close tabs from popup
- [ ] Duplicate detection works
- [ ] Auto-cleanup runs on schedule
- [ ] Settings UI allows configuration
- [ ] Data persists across sessions

---

**Status**: Planning phase
**Next Steps**: Confirm key decisions, set up project structure, begin Phase 1
