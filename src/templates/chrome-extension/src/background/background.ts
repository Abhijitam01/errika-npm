/**
 * Background Service Worker
 * Handles extension lifecycle events and message routing
 */

import { handleMessage, createContextMenus, handleContextMenuClick } from './messageHandler';
import { onStorageChanged } from '../utils/storage';
import { broadcastMessage } from '../utils/messaging';
import type { MessageType } from '../types';

console.log('Background service worker started');

/**
 * Extension installation/update handler
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    console.log('First time installation');
    
    // Set default storage values
    chrome.storage.local.set({
      firstInstall: Date.now(),
      version: chrome.runtime.getManifest().version
    });
    
    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'options.html' });
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('Extension updated');
  }
  
  // Create context menus
  createContextMenus();
});

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return handleMessage(message, sender, sendResponse);
});

/**
 * Context menu click handler
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleContextMenuClick(info, tab);
});

/**
 * Storage change listener
 */
onStorageChanged((changes, areaName) => {
  console.log('Storage changed:', changes, 'in area:', areaName);
  
  // Broadcast storage changes to all tabs
  broadcastMessage({
    type: 'STORAGE_CHANGED' as MessageType,
    payload: { changes, areaName }
  }).catch(error => {
    console.error('Error broadcasting storage change:', error);
  });
});

/**
 * Tab update listener
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tabId, tab.url);
    
    // Perform actions when tab loads
    // Example: Update badge, inject scripts, etc.
  }
});

/**
 * Tab activation listener
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);
  
  // Perform actions when user switches tabs
  // Example: Update popup state, refresh badge, etc.
});

/**
 * Browser action click handler (when popup is not set)
 */
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked:', tab);
  
  // This only fires if no popup is set in manifest
  // Can be used to toggle extension state or perform quick actions
});

/**
 * Alarm listener (for periodic tasks)
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm fired:', alarm.name);
  
  // Handle scheduled tasks
  switch (alarm.name) {
    case 'periodic-task':
      // Perform periodic task
      break;
  }
});

/**
 * Create alarms (optional)
 */
chrome.alarms.create('periodic-task', {
  delayInMinutes: 1,
  periodInMinutes: 60
});

/**
 * Commands listener (keyboard shortcuts)
 */
chrome.commands.onCommand.addListener((command) => {
  console.log('Command executed:', command);
  
  switch (command) {
    case 'toggle-extension':
      // Toggle extension state
      break;
    case 'open-popup':
      // Open popup programmatically
      break;
  }
});

/**
 * Keep service worker alive (optional)
 * Note: Service workers are designed to be event-driven and ephemeral
 * Only use this if you have a specific need
 */
let lifeline: chrome.runtime.Port | null = null;

function keepAlive() {
  if (lifeline) return;
  
  lifeline = chrome.runtime.connect({ name: 'keepalive' });
  lifeline.onDisconnect.addListener(() => {
    lifeline = null;
    keepAlive();
  });
}

// Uncomment to keep service worker alive
// keepAlive();
