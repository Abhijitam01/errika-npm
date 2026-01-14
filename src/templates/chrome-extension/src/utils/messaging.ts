/**
 * Chrome Messaging Utilities
 * Type-safe wrappers for Chrome messaging API
 */

import type { ChromeMessage, MessageResponse, TabInfo } from '../types';

/**
 * Send message to background script
 */
export async function sendMessageToBackground<T = any>(
  message: ChromeMessage
): Promise<MessageResponse<T>> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response: MessageResponse<T>) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Send message to content script in active tab
 */
export async function sendMessageToActiveTab<T = any>(
  message: ChromeMessage
): Promise<MessageResponse<T>> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) {
      throw new Error('No active tab found');
    }
    return sendMessageToTab(tab.id, message);
  } catch (error) {
    console.error('Error sending message to active tab:', error);
    throw error;
  }
}

/**
 * Send message to content script in specific tab
 */
export async function sendMessageToTab<T = any>(
  tabId: number,
  message: ChromeMessage
): Promise<MessageResponse<T>> {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(tabId, message, (response: MessageResponse<T>) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Send message to all tabs
 */
export async function broadcastMessage(message: ChromeMessage): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({});
    const promises = tabs.map((tab) => {
      if (tab.id) {
        return sendMessageToTab(tab.id, message).catch((error) => {
          // Silently catch errors for tabs that don't have content scripts
          console.debug(`Could not send message to tab ${tab.id}:`, error);
        });
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error('Error broadcasting message:', error);
    throw error;
  }
}

/**
 * Listen for messages from any source
 */
export function onMessage(
  callback: (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => boolean | void
): void {
  chrome.runtime.onMessage.addListener(callback);
}

/**
 * Remove message listener
 */
export function removeMessageListener(
  callback: (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => boolean | void
): void {
  chrome.runtime.onMessage.removeListener(callback);
}

/**
 * Get current active tab
 */
export async function getActiveTab(): Promise<TabInfo | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return null;
    
    return {
      id: tab.id,
      url: tab.url,
      title: tab.title,
      active: tab.active
    };
  } catch (error) {
    console.error('Error getting active tab:', error);
    return null;
  }
}

/**
 * Get all tabs
 */
export async function getAllTabs(): Promise<TabInfo[]> {
  try {
    const tabs = await chrome.tabs.query({});
    return tabs.map(tab => ({
      id: tab.id,
      url: tab.url,
      title: tab.title,
      active: tab.active
    }));
  } catch (error) {
    console.error('Error getting all tabs:', error);
    return [];
  }
}

/**
 * Create a new tab
 */
export async function createTab(url: string, active = true): Promise<TabInfo | null> {
  try {
    const tab = await chrome.tabs.create({ url, active });
    return {
      id: tab.id,
      url: tab.url,
      title: tab.title,
      active: tab.active
    };
  } catch (error) {
    console.error('Error creating tab:', error);
    return null;
  }
}

/**
 * Update badge text
 */
export async function updateBadge(text: string, color?: string): Promise<void> {
  try {
    await chrome.action.setBadgeText({ text });
    if (color) {
      await chrome.action.setBadgeBackgroundColor({ color });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
    throw error;
  }
}

/**
 * Clear badge text
 */
export async function clearBadge(): Promise<void> {
  try {
    await chrome.action.setBadgeText({ text: '' });
  } catch (error) {
    console.error('Error clearing badge:', error);
    throw error;
  }
}

/**
 * Show notification
 */
export async function showNotification(
  title: string,
  message: string,
  options?: chrome.notifications.NotificationOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const notificationOptions: chrome.notifications.NotificationOptions = {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon48.png'),
        title,
        message,
        ...options
      };
      
      chrome.notifications.create('', notificationOptions, (notificationId) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(notificationId);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Execute script in active tab
 */
export async function executeScriptInActiveTab(
  func: () => void,
  args?: any[]
): Promise<any[]> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) {
      throw new Error('No active tab found');
    }
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func,
      args
    });
    
    return results.map(result => result.result);
  } catch (error) {
    console.error('Error executing script:', error);
    throw error;
  }
}

