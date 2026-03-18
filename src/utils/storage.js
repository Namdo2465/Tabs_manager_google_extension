/**
 * Storage utilities for chrome.storage.local
 */

const DEFAULT_SETTINGS = {
  inactiveThresholdDays: 3,
  autoCleanupEnabled: false,
  requireConfirmation: true,
};

/**
 * Get all stored tab tracking data
 */
export async function getTabTracking() {
  const result = await chrome.storage.local.get('tabTracking');
  return result.tabTracking || {};
}

/**
 * Update tab tracking for a specific tab
 */
export async function updateTabTracking(tabId, data) {
  const tracking = await getTabTracking();
  tracking[tabId] = {
    ...tracking[tabId],
    ...data,
  };
  await chrome.storage.local.set({ tabTracking: tracking });
}

/**
 * Remove tab tracking data
 */
export async function removeTabTracking(tabId) {
  const tracking = await getTabTracking();
  delete tracking[tabId];
  await chrome.storage.local.set({ tabTracking: tracking });
}

/**
 * Get extension settings
 */
export async function getSettings() {
  const result = await chrome.storage.local.get('settings');
  return { ...DEFAULT_SETTINGS, ...result.settings };
}

/**
 * Update extension settings
 */
export async function updateSettings(settings) {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ settings: updated });
}

/**
 * Get setting by key
 */
export async function getSetting(key) {
  const settings = await getSettings();
  return settings[key];
}

/**
 * Initialize storage on first install
 */
export async function initializeStorage() {
  const result = await chrome.storage.local.get(['tabTracking', 'settings']);
  
  if (!result.tabTracking) {
    await chrome.storage.local.set({ tabTracking: {} });
  }
  
  if (!result.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
}
