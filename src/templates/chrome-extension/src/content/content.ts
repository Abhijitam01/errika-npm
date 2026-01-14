/**
 * Content Script
 * Runs on web pages and can interact with the DOM
 */

import './content.css';
import { onMessage } from '../utils/messaging';
import { MessageType, type ChromeMessage, type MessageResponse } from '../types';

console.log('Content script loaded on:', window.location.href);

// Notify background script that content script has loaded
chrome.runtime.sendMessage({
  type: MessageType.CONTENT_SCRIPT_LOADED,
  payload: {
    url: window.location.href,
    timestamp: Date.now()
  }
}).catch(error => {
  console.error('Error sending content script loaded message:', error);
});

/**
 * Create and show an overlay on the page
 */
function createOverlay(message: string): HTMLElement {
  // Remove any existing overlay
  const existing = document.querySelector('.errika-ext-overlay');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.className = 'errika-ext-overlay';
  overlay.innerHTML = `
    <div class="errika-ext-overlay-header">
      <h3 class="errika-ext-overlay-title">Extension Active</h3>
      <button class="errika-ext-overlay-close">×</button>
    </div>
    <div class="errika-ext-overlay-content">
      <p>${message}</p>
      <p>Page: ${document.title}</p>
    </div>
  `;

  const closeButton = overlay.querySelector('.errika-ext-overlay-close');
  closeButton?.addEventListener('click', () => {
    overlay.remove();
  });

  document.body.appendChild(overlay);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (overlay.parentElement) {
      overlay.remove();
    }
  }, 5000);

  return overlay;
}

/**
 * Highlight an element on the page
 */
function highlightElement(selector: string): void {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.classList.add('errika-ext-highlight');
    setTimeout(() => {
      element.classList.remove('errika-ext-highlight');
    }, 2000);
  });
}

/**
 * Get page information
 */
function getPageInfo() {
  return {
    url: window.location.href,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    wordCount: document.body.innerText.split(/\s+/).length,
    links: document.querySelectorAll('a').length,
    images: document.querySelectorAll('img').length
  };
}

/**
 * Create a tooltip
 */
function createTooltip(x: number, y: number, text: string): HTMLElement {
  const tooltip = document.createElement('div');
  tooltip.className = 'errika-ext-tooltip';
  tooltip.textContent = text;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y - 40}px`;
  
  document.body.appendChild(tooltip);

  setTimeout(() => {
    if (tooltip.parentElement) {
      tooltip.remove();
    }
  }, 3000);

  return tooltip;
}

/**
 * Handle messages from background script or popup
 */
onMessage((message: ChromeMessage, sender, sendResponse) => {
  console.log('Content script received message:', message);

  try {
    switch (message.type) {
      case MessageType.EXECUTE_ACTION:
        if (message.payload.action === 'show-overlay') {
          createOverlay(message.payload.data?.message || 'Hello from extension!');
          sendResponse({ success: true });
        } else if (message.payload.action === 'highlight') {
          highlightElement(message.payload.data?.selector || 'h1');
          sendResponse({ success: true });
        } else if (message.payload.action === 'get-page-info') {
          const pageInfo = getPageInfo();
          sendResponse({ success: true, data: pageInfo });
        } else {
          sendResponse({ success: false, error: 'Unknown action' });
        }
        break;

      case MessageType.STORAGE_CHANGED:
        console.log('Storage changed:', message.payload);
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }

  return true; // Keep message channel open for async response
});

/**
 * Example: Add a floating button to the page
 */
function addFloatingButton(): void {
  const button = document.createElement('button');
  button.className = 'errika-ext-button';
  button.textContent = '🎯 Extension';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999997;
  `;

  button.addEventListener('click', () => {
    createOverlay('Button clicked! Extension is working.');
  });

  document.body.appendChild(button);
}

/**
 * Example: Monitor page changes
 */
function monitorPageChanges(): void {
  const observer = new MutationObserver((mutations) => {
    console.log('Page changed:', mutations.length, 'mutations');
    // You can handle DOM changes here
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
}

/**
 * Initialize content script
 */
function init(): void {
  console.log('Initializing content script...');
  
  // Uncomment features you want to enable:
  // addFloatingButton();
  // monitorPageChanges();
  
  // Example: Show overlay on specific pages
  if (window.location.hostname.includes('example.com')) {
    createOverlay('Extension is active on this page!');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for page navigation (SPA support)
let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log('Navigation detected:', currentUrl);
    // Reinitialize or handle navigation
  }
}).observe(document, { subtree: true, childList: true });
