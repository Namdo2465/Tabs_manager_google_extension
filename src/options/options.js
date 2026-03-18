/**
 * Options page script for Smart Tab Manager
 * Handles settings management
 */

import { getSettings, updateSettings } from '../utils/storage.js';

const thresholdDaysInput = document.getElementById('thresholdDays');
const autoCleanupEnabledCheckbox = document.getElementById('autoCleanupEnabled');
const requireConfirmationCheckbox = document.getElementById('requireConfirmation');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  attachEventListeners();
});

function attachEventListeners() {
  saveBtn.addEventListener('click', saveSettings);
  resetBtn.addEventListener('click', resetSettings);
}

/**
 * Load settings from storage and populate form
 */
async function loadSettings() {
  try {
    const settings = await getSettings();

    thresholdDaysInput.value = settings.inactiveThresholdDays;
    autoCleanupEnabledCheckbox.checked = settings.autoCleanupEnabled;
    requireConfirmationCheckbox.checked = settings.requireConfirmation;
  } catch (error) {
    console.error('Error loading settings:', error);
    showMessage('Failed to load settings', 'error');
  }
}

/**
 * Save settings
 */
async function saveSettings() {
  try {
    const settings = {
      inactiveThresholdDays: parseInt(thresholdDaysInput.value) || 3,
      autoCleanupEnabled: autoCleanupEnabledCheckbox.checked,
      requireConfirmation: requireConfirmationCheckbox.checked,
    };

    // Validate
    if (settings.inactiveThresholdDays < 1 || settings.inactiveThresholdDays > 30) {
      showMessage('Threshold must be between 1 and 30 days', 'error');
      return;
    }

    await updateSettings(settings);
    showMessage('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showMessage('Failed to save settings', 'error');
  }
}

/**
 * Reset settings to defaults
 */
async function resetSettings() {
  const confirmed = confirm('Reset all settings to default values?');
  if (!confirmed) return;

  try {
    const defaultSettings = {
      inactiveThresholdDays: 3,
      autoCleanupEnabled: false,
      requireConfirmation: true,
    };

    await updateSettings(defaultSettings);
    await loadSettings();
    showMessage('Settings reset to defaults', 'success');
  } catch (error) {
    console.error('Error resetting settings:', error);
    showMessage('Failed to reset settings', 'error');
  }
}

/**
 * Show message to user
 */
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;

  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 3000);
}
