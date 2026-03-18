/**
 * Popup script for Smart Tab Manager
 * Handles UI rendering and user interactions
 */

import { 
  getAllTabs, 
  enrichTabsWithTracking, 
  findDuplicates, 
  formatTimeAgo, 
  getFaviconUrl,
  closeTabs,
  closeTab 
} from '../utils/tab-utils.js';
import { getSettings, updateTabTracking } from '../utils/storage.js';

let currentTabs = [];
let duplicateGroups = [];

// DOM Elements
const tabList = document.getElementById('tabList');
const totalTabsEl = document.getElementById('totalTabs');
const inactiveTabsEl = document.getElementById('inactiveTabs');
const duplicateTabsEl = document.getElementById('duplicateTabs');
const refreshBtn = document.getElementById('refreshBtn');
const settingsBtn = document.getElementById('settingsBtn');
const cleanupBtn = document.getElementById('cleanupBtn');
const closeDuplicatesBtn = document.getElementById('closeDuplicatesBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderTabs();
  attachEventListeners();
});

function attachEventListeners() {
  refreshBtn.addEventListener('click', loadAndRenderTabs);
  settingsBtn.addEventListener('click', openSettings);
  cleanupBtn.addEventListener('click', runCleanup);
  closeDuplicatesBtn.addEventListener('click', closeDuplicates);
}

/**
 * Load all tabs and render the UI
 */
async function loadAndRenderTabs() {
  tabList.innerHTML = '<div class="loading">Loading tabs...</div>';

  try {
    const tabs = await getAllTabs();
    currentTabs = await enrichTabsWithTracking(tabs);
    duplicateGroups = findDuplicates(currentTabs);

    updateStats();
    renderTabList();
  } catch (error) {
    console.error('Error loading tabs:', error);
    tabList.innerHTML = '<div class="loading">Error loading tabs</div>';
  }
}

/**
 * Update stats display
 */
function updateStats() {
  const inactiveCount = currentTabs.filter(t => t.isInactive).length;
  const duplicateCount = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);

  totalTabsEl.textContent = currentTabs.length;
  inactiveTabsEl.textContent = inactiveCount;
  duplicateTabsEl.textContent = duplicateCount;
}

/**
 * Render tab list UI
 */
function renderTabList() {
  if (currentTabs.length === 0) {
    tabList.innerHTML = '<div class="loading">No tabs open</div>';
    return;
  }

  // Get set of duplicate tab IDs for quick lookup
  const duplicateIds = new Set();
  duplicateGroups.forEach(group => {
    group.forEach(tab => duplicateIds.add(tab.id));
  });

  tabList.innerHTML = '';

  currentTabs.forEach(tab => {
    const tabEl = createTabElement(tab, duplicateIds);
    tabList.appendChild(tabEl);
  });
}

/**
 * Create a tab item element
 */
function createTabElement(tab, duplicateIds) {
  const div = document.createElement('div');
  div.className = 'tab-item';

  if (tab.active) div.classList.add('active');
  if (tab.isInactive) div.classList.add('inactive');
  if (duplicateIds.has(tab.id)) div.classList.add('duplicate');

  const favicon = getFaviconUrl(tab);
  const lastAccessedText = formatTimeAgo(tab.lastAccessed);

  div.innerHTML = `
    <div class="tab-favicon">
      <img src="${favicon}" alt="icon" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text x=%220%22 y=%2214%22 font-size=%2214%22 fill=%22gray%22>?</text></svg>'">
    </div>
    <div class="tab-info">
      <div class="tab-title" title="${tab.title}">${escapeHtml(tab.title)}</div>
      <div class="tab-url" title="${tab.url}">${escapeHtml(tab.url)}</div>
      <div class="tab-meta">
        <span>${lastAccessedText}</span>
        ${tab.active ? '<span class="tab-badge active">Active</span>' : ''}
        ${tab.isInactive ? '<span class="tab-badge inactive">Inactive</span>' : ''}
        ${duplicateIds.has(tab.id) ? '<span class="tab-badge duplicate">Duplicate</span>' : ''}
      </div>
    </div>
    <div class="tab-actions">
      <button class="tab-btn close" title="Close tab" data-tab-id="${tab.id}">✕</button>
    </div>
  `;

  // Close tab action
  const closeBtn = div.querySelector('.tab-btn.close');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleCloseTab(tab.id);
  });

  // Click to switch to tab
  div.addEventListener('click', () => {
    chrome.tabs.update(tab.id, { active: true });
  });

  return div;
}

/**
 * Handle close tab action
 */
async function handleCloseTab(tabId) {
  try {
    await closeTab(tabId);
    currentTabs = currentTabs.filter(t => t.id !== tabId);
    duplicateGroups = findDuplicates(currentTabs);
    updateStats();
    renderTabList();
  } catch (error) {
    console.error('Error closing tab:', error);
    alert('Failed to close tab');
  }
}

/**
 * Run auto cleanup
 */
async function runCleanup() {
  try {
    const settings = await getSettings();
    if (!settings.autoCleanupEnabled) {
      const proceed = confirm(
        'Auto-cleanup is currently disabled.\n\nDo you want to enable it and run cleanup now?'
      );
      if (!proceed) return;
    }

    const result = await chrome.runtime.sendMessage({ action: 'autoCleanup' });
    
    if (result.success) {
      alert(
        `Cleanup complete!\n\n` +
        `Inactive tabs closed: ${result.inactiveClosed}\n` +
        `Duplicates closed: ${result.duplicatesClosed}`
      );
      await loadAndRenderTabs();
    } else {
      alert('Cleanup failed: ' + result.message);
    }
  } catch (error) {
    console.error('Error running cleanup:', error);
    alert('Failed to run cleanup');
  }
}

/**
 * Close duplicate tabs
 */
async function closeDuplicates() {
  if (duplicateGroups.length === 0) {
    alert('No duplicate tabs found');
    return;
  }

  const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);
  const proceed = confirm(
    `Found ${duplicateGroups.length} duplicate group(s).\n\n` +
    `This will close ${totalDuplicates} tabs (keeping 1 per group).\n\n` +
    `Continue?`
  );

  if (!proceed) return;

  try {
    const tabsToClose = [];
    duplicateGroups.forEach(group => {
      const toClose = group.slice(1).map(t => t.id);
      tabsToClose.push(...toClose);
    });

    await closeTabs(tabsToClose);
    
    alert(`Closed ${tabsToClose.length} duplicate tab(s)`);
    await loadAndRenderTabs();
  } catch (error) {
    console.error('Error closing duplicates:', error);
    alert('Failed to close duplicates');
  }
}

/**
 * Open settings page
 */
function openSettings() {
  chrome.runtime.openOptionsPage();
  window.close();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
