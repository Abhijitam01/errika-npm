/**
 * Chrome Extension Type Definitions
 */

// Message types for communication between components
export enum MessageType {
  GET_DATA = 'GET_DATA',
  SET_DATA = 'SET_DATA',
  UPDATE_BADGE = 'UPDATE_BADGE',
  EXECUTE_ACTION = 'EXECUTE_ACTION',
  CONTENT_SCRIPT_LOADED = 'CONTENT_SCRIPT_LOADED',
  STORAGE_CHANGED = 'STORAGE_CHANGED'
}

// Base message structure
export interface BaseMessage {
  type: MessageType;
  payload?: any;
}

// Specific message types
export interface GetDataMessage extends BaseMessage {
  type: MessageType.GET_DATA;
  payload: {
    key: string;
  };
}

export interface SetDataMessage extends BaseMessage {
  type: MessageType.SET_DATA;
  payload: {
    key: string;
    value: any;
  };
}

export interface UpdateBadgeMessage extends BaseMessage {
  type: MessageType.UPDATE_BADGE;
  payload: {
    text: string;
    color?: string;
  };
}

export interface ExecuteActionMessage extends BaseMessage {
  type: MessageType.EXECUTE_ACTION;
  payload: {
    action: string;
    data?: any;
  };
}

export interface ContentScriptLoadedMessage extends BaseMessage {
  type: MessageType.CONTENT_SCRIPT_LOADED;
  payload: {
    url: string;
    timestamp: number;
  };
}

export interface StorageChangedMessage extends BaseMessage {
  type: MessageType.STORAGE_CHANGED;
  payload: {
    changes: chrome.storage.StorageChange;
    areaName: 'sync' | 'local' | 'managed';
  };
}

// Union type for all messages
export type ChromeMessage =
  | GetDataMessage
  | SetDataMessage
  | UpdateBadgeMessage
  | ExecuteActionMessage
  | ContentScriptLoadedMessage
  | StorageChangedMessage;

// Storage data types
export interface StorageData {
  [key: string]: any;
}

export interface ExtensionSettings {
  enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoRun: boolean;
  customSettings?: Record<string, any>;
}

// Tab information
export interface TabInfo {
  id?: number;
  url?: string;
  title?: string;
  active: boolean;
}

// Response types
export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Context menu types
export interface ContextMenuItem {
  id: string;
  title: string;
  contexts: chrome.contextMenus.ContextType[];
  onClick?: (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => void;
}

