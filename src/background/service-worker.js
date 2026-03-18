/**
 * Background Service Worker for Smart Tab Manager
 * Handles tab tracking, auto-cleanup, and message passing
 */

import { initializeStorage, updateTabTracking, removeTabTracking, getSettings } from '../utils/storage.js';
import { getAllTabs, closeTabs, findDuplicates, normalizeUrl } from '../utils/tab-utils.js';

// Initialize on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await initializeStorage();
  }
});

// Track tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTabTracking(activeInfo.tabId, {
    lastAccessed: Date.now(),
  });
});

// Clean up tracking data when tab is closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  await removeTabTracking(tabId);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'closeTab') {
    chrome.tabs.remove([message.tabId]);
    sendResponse({ success: true });
  } else if (message.action === 'closeDuplicates') {
    handleCloseDuplicates(message.tabIds).then(result => sendResponse(result));
    return true;
  } else if (message.action === 'autoCleanup') {
    handleAutoCleanup().then(result => sendResponse(result));
    return true;
  }
});

/**
 * Close duplicate tabs, keeping the first one
 */
async function handleCloseDuplicates(tabIds) {
  if (tabIds.length <= 1) return { success: false, message: 'No duplicates to close' };

  const toClose = tabIds.slice(1);
  await closeTabs(toClose);

  return { success: true, closed: toClose.length };
}

/**
 * Run auto-cleanup: remove inactive tabs and duplicates
 */
async function handleAutoCleanup() {
  const settings = await getSettings();
  if (!settings.autoCleanupEnabled) {
    return { success: false, message: 'Auto-cleanup is disabled' };
  }

  const tabs = await getAllTabs();
  const inactiveThresholdMs = settings.inactiveThresholdDays * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const trackingData = await chrome.storage.local.get('tabTracking');
  const tracking = trackingData.tabTracking || {};

  // Find inactive tabs
  const inactiveTabIds = [];
  tabs.forEach(tab => {
    const tabData = tracking[tab.id] || {};
    const lastAccessed = tabData.lastAccessed || now;
    if ((now - lastAccessed) > inactiveThresholdMs) {
      inactiveTabIds.push(tab.id);
    }
  });

  // Find duplicate tabs (keep first of each group)
  const duplicatesToClose = [];
  const duplicates = findDuplicates(tabs);
  duplicates.forEach(group => {
    // Keep the first tab, close the rest
    duplicatesToClose.push(...group.slice(1).map(t => t.id));
  });

  // Combine tabs to close
  const allToClose = [...new Set([...inactiveTabIds, ...duplicatesToClose])];

  if (allToClose.length > 0) {
    await closeTabs(allToClose);
  }

  return {
    success: true,
    inactiveClosed: inactiveTabIds.length,
    duplicatesClosed: duplicatesToClose.length,
  };
}

// Set up periodic cleanup alarm (daily)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'autoCleanup') {
    const settings = await getSettings();
    if (settings.autoCleanupEnabled && settings.requireConfirmation === false) {
      await handleAutoCleanup();
    }
  }
});

// Create alarm on first run
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('autoCleanup', { periodInMinutes: 1440 }); // Daily
});
