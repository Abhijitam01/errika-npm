/**
 * Message Handler for Background Script
 * Routes messages to appropriate handlers
 */

import type { ChromeMessage, MessageResponse, MessageType } from '../types';
import { getStorageData, setStorageData } from '../utils/storage';
import { updateBadge, clearBadge } from '../utils/messaging';

/**
 * Handle GET_DATA messages
 */
async function handleGetData(payload: any): Promise<MessageResponse> {
  try {
    const data = await getStorageData(payload.key);
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Handle SET_DATA messages
 */
async function handleSetData(payload: any): Promise<MessageResponse> {
  try {
    await setStorageData({ [payload.key]: payload.value });
    return {
      success: true,
      data: { key: payload.key, value: payload.value }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Handle UPDATE_BADGE messages
 */
async function handleUpdateBadge(payload: any): Promise<MessageResponse> {
  try {
    await updateBadge(payload.text, payload.color);
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Handle EXECUTE_ACTION messages
 */
async function handleExecuteAction(payload: any): Promise<MessageResponse> {
  try {
    console.log('Executing action:', payload.action, payload.data);
    
    // Add your custom action handlers here
    switch (payload.action) {
      case 'example-action':
        // Perform some action
        return {
          success: true,
          data: { message: 'Action executed successfully' }
        };
      
      default:
        return {
          success: false,
          error: `Unknown action: ${payload.action}`
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Handle CONTENT_SCRIPT_LOADED messages
 */
function handleContentScriptLoaded(payload: any): MessageResponse {
  console.log('Content script loaded:', payload);
  return {
    success: true,
    data: { message: 'Content script acknowledged' }
  };
}

/**
 * Main message handler
 */
export async function handleMessage(
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse) => void
): Promise<boolean> {
  console.log('Received message:', message.type, 'from:', sender);

  try {
    let response: MessageResponse;

    switch (message.type) {
      case 'GET_DATA':
        response = await handleGetData(message.payload);
        break;
      
      case 'SET_DATA':
        response = await handleSetData(message.payload);
        break;
      
      case 'UPDATE_BADGE':
        response = await handleUpdateBadge(message.payload);
        break;
      
      case 'EXECUTE_ACTION':
        response = await handleExecuteAction(message.payload);
        break;
      
      case 'CONTENT_SCRIPT_LOADED':
        response = handleContentScriptLoaded(message.payload);
        break;
      
      default:
        response = {
          success: false,
          error: `Unknown message type: ${message.type}`
        };
    }

    sendResponse(response);
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Return true to indicate we'll send response asynchronously
  return true;
}

/**
 * Create context menu items
 */
export function createContextMenus(): void {
  chrome.contextMenus.create({
    id: 'example-menu-item',
    title: 'Example Action',
    contexts: ['selection']
  });
}

/**
 * Handle context menu clicks
 */
export function handleContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): void {
  console.log('Context menu clicked:', info, tab);
  
  switch (info.menuItemId) {
    case 'example-menu-item':
      // Handle the menu item click
      console.log('Selected text:', info.selectionText);
      break;
  }
}

