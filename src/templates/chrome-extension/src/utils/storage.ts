/**
 * Chrome Storage Utilities
 * Type-safe wrappers for Chrome Storage API
 */

import type { StorageData, ExtensionSettings } from '../types';

/**
 * Storage area types
 */
export type StorageArea = 'local' | 'sync' | 'managed';

/**
 * Get data from Chrome storage
 */
export async function getStorageData<T = any>(
  keys: string | string[] | null,
  area: StorageArea = 'local'
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage[area].get(keys, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result as T);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Set data in Chrome storage
 */
export async function setStorageData(
  data: StorageData,
  area: StorageArea = 'local'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage[area].set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Remove data from Chrome storage
 */
export async function removeStorageData(
  keys: string | string[],
  area: StorageArea = 'local'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage[area].remove(keys, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Clear all data from Chrome storage
 */
export async function clearStorage(area: StorageArea = 'local'): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage[area].clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get storage usage
 */
export async function getStorageUsage(
  keys?: string | string[] | null,
  area: StorageArea = 'local'
): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage[area].getBytesInUse(keys || null, (bytes) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(bytes);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Listen for storage changes
 */
export function onStorageChanged(
  callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void
): void {
  chrome.storage.onChanged.addListener(callback);
}

/**
 * Remove storage change listener
 */
export function removeStorageListener(
  callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void
): void {
  chrome.storage.onChanged.removeListener(callback);
}

/**
 * Default extension settings
 */
export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  theme: 'auto',
  notifications: true,
  autoRun: false,
  customSettings: {}
};

/**
 * Get extension settings
 */
export async function getSettings(): Promise<ExtensionSettings> {
  try {
    const data = await getStorageData<{ settings?: ExtensionSettings }>('settings', 'sync');
    return { ...DEFAULT_SETTINGS, ...data.settings };
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save extension settings
 */
export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...settings };
    await setStorageData({ settings: newSettings }, 'sync');
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

/**
 * Reset settings to default
 */
export async function resetSettings(): Promise<void> {
  try {
    await setStorageData({ settings: DEFAULT_SETTINGS }, 'sync');
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
}

