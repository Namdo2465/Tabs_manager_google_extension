/**
 * Utilities for tab operations and analysis
 */

import { getTabTracking, getSetting } from './storage.js';

/**
 * Get all tabs in the current window
 */
export async function getAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs;
}

/**
 * Get active tab in current window
 */
export async function getActiveTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  return tabs[0] || null;
}

/**
 * Enrich tabs with tracking data (last accessed, status)
 */
export async function enrichTabsWithTracking(tabs) {
  const tracking = await getTabTracking();
  const inactiveThresholdMs = (await getSetting('inactiveThresholdDays')) * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return tabs.map(tab => {
    const tabData = tracking[tab.id] || {};
    const lastAccessed = tabData.lastAccessed || now;
    const isInactive = (now - lastAccessed) > inactiveThresholdMs;

    return {
      ...tab,
      lastAccessed,
      isInactive,
      inactiveFor: now - lastAccessed,
    };
  });
}

/**
 * Find duplicate tabs (same URL)
 */
export function findDuplicates(tabs) {
  const urlMap = {};
  const duplicates = [];

  tabs.forEach(tab => {
    const url = normalizeUrl(tab.url);
    if (!urlMap[url]) {
      urlMap[url] = [];
    }
    urlMap[url].push(tab);
  });

  Object.values(urlMap).forEach(group => {
    if (group.length > 1) {
      duplicates.push(group);
    }
  });

  return duplicates;
}

/**
 * Normalize URL for comparison (remove trailing slashes, sort query params)
 */
export function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    const normalized = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    return normalized.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/**
 * Group tabs by domain
 */
export function groupTabsByDomain(tabs) {
  const domainMap = {};

  tabs.forEach(tab => {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      if (!domainMap[domain]) {
        domainMap[domain] = [];
      }
      domainMap[domain].push(tab);
    } catch {
      if (!domainMap['other']) {
        domainMap['other'] = [];
      }
      domainMap['other'].push(tab);
    }
  });

  return domainMap;
}

/**
 * Close multiple tabs
 */
export async function closeTabs(tabIds) {
  await chrome.tabs.remove(tabIds);
}

/**
 * Close tab by ID
 */
export async function closeTab(tabId) {
  await chrome.tabs.remove([tabId]);
}

/**
 * Format timestamp for display (e.g., "2 hours ago")
 */
export function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

/**
 * Get favicon URL from tab
 */
export function getFaviconUrl(tab) {
  if (tab.favIconUrl) return tab.favIconUrl;
  
  try {
    const url = new URL(tab.url);
    return `${url.protocol}//${url.host}/favicon.ico`;
  } catch {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="0" y="14" font-size="14" fill="gray">?</text></svg>';
  }
}
