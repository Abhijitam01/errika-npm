# {{projectName}}

A modern Chrome extension built with React, TypeScript, and Vite. Created with [Errika](https://github.com/Abhijitam01/errika-npm).

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

Build the extension in development mode with source maps:

```bash
npm run dev
```

### Production Build

Build the extension for production:

```bash
npm run build
```

## 📦 Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `dist` folder from this project

After loading, you'll see the extension icon in your Chrome toolbar!

## 🏗️ Project Structure

```
├── src/
│   ├── background/           # Background service worker
│   │   ├── background.ts    # Main background script
│   │   └── messageHandler.ts # Message routing logic
│   │
│   ├── content/             # Content scripts (injected into pages)
│   │   ├── content.ts       # Content script logic
│   │   └── content.css      # Injected styles
│   │
│   ├── popup/               # Extension popup UI
│   │   ├── Popup.tsx        # Main popup component
│   │   ├── popup.css        # Popup styles
│   │   ├── main.tsx         # Popup entry point
│   │   └── index.html       # Popup HTML
│   │
│   ├── options/             # Options page
│   │   ├── Options.tsx      # Options component
│   │   ├── options.css      # Options styles
│   │   ├── main.tsx         # Options entry point
│   │   └── index.html       # Options HTML
│   │
│   ├── components/          # Shared React components
│   │   ├── Button.tsx       # Button component
│   │   ├── Button.css
│   │   ├── Toggle.tsx       # Toggle switch component
│   │   └── Toggle.css
│   │
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # Chrome storage helpers
│   │   └── messaging.ts     # Message passing helpers
│   │
│   └── types/               # TypeScript definitions
│       └── index.ts         # Type definitions
│
├── public/
│   ├── manifest.json        # Extension manifest (V3)
│   └── icons/               # Extension icons (16, 32, 48, 128px)
│
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## ✨ Features

### 🎯 Manifest V3
- Latest Chrome extension manifest version
- Service worker-based background scripts
- Enhanced security and performance

### ⚛️ React 19
- Modern React with hooks
- Component-based architecture
- Fast UI updates

### 📘 TypeScript
- Full type safety
- Better IDE support
- Fewer runtime errors

### ⚡ Vite
- Lightning-fast builds
- Hot module replacement in development
- Optimized production bundles

### 💾 Chrome Storage API
- Sync storage across devices
- Local storage for larger data
- Type-safe storage utilities

### 📬 Message Passing
- Type-safe messaging between components
- Popup ↔ Background ↔ Content script communication
- Async message handling

### 🎨 Beautiful UI
- Modern, gradient-based design
- Responsive components
- Smooth animations

## 🔧 Extension Components

### Popup
Click the extension icon to open the popup interface. The popup provides quick access to extension features.

**Location:** `src/popup/Popup.tsx`

**Features:**
- Counter example with Chrome storage
- Current tab information
- Message passing demonstration
- Quick access to options page

### Options Page
Right-click the extension icon and select "Options" to open the full options page.

**Location:** `src/options/Options.tsx`

**Features:**
- Extension settings management
- Toggle switches for features
- Theme selection
- Settings persistence with Chrome sync storage

### Background Script
The background service worker runs independently and handles:
- Extension lifecycle events
- Message routing between components
- Context menu management
- Periodic tasks and alarms
- Cross-tab communication

**Location:** `src/background/background.ts`

### Content Scripts
Content scripts run on web pages and can interact with the DOM.

**Location:** `src/content/content.ts`

**Features:**
- DOM manipulation
- Page information extraction
- Overlay injection
- Element highlighting
- Message handling from popup/background

**Configuration:** Set which pages run the content script in `public/manifest.json` under `content_scripts.matches`.

## 🔌 API Usage Examples

### Chrome Storage

```typescript
import { getStorageData, setStorageData } from './utils/storage';

// Save data
await setStorageData({ key: 'value' }, 'sync');

// Retrieve data
const data = await getStorageData<{ key: string }>('key', 'sync');
```

### Message Passing

```typescript
import { sendMessageToBackground, MessageType } from './utils/messaging';

// Send message from popup to background
const response = await sendMessageToBackground({
  type: MessageType.EXECUTE_ACTION,
  payload: { action: 'example-action', data: {} }
});
```

### Tab Management

```typescript
import { getActiveTab, createTab } from './utils/messaging';

// Get current tab
const tab = await getActiveTab();

// Create new tab
await createTab('https://example.com');
```

### Badge Updates

```typescript
import { updateBadge, clearBadge } from './utils/messaging';

// Show badge
await updateBadge('5', '#4285f4');

// Clear badge
await clearBadge();
```

## 📝 Customization

### Modify Permissions

Edit `public/manifest.json` to add or remove permissions:

```json
{
  "permissions": [
    "storage",
    "activeTab",
    "notifications"  // Add new permission
  ]
}
```

### Change Content Script Matches

Control which websites run your content script:

```json
{
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],  // Specific domain
    "js": ["content.js"]
  }]
}
```

### Add Context Menus

In `src/background/messageHandler.ts`:

```typescript
export function createContextMenus(): void {
  chrome.contextMenus.create({
    id: 'my-menu-item',
    title: 'My Action',
    contexts: ['selection', 'link', 'image']
  });
}
```

### Add Keyboard Shortcuts

In `public/manifest.json`:

```json
{
  "commands": {
    "toggle-extension": {
      "suggested_key": {
        "default": "Ctrl+Shift+E"
      },
      "description": "Toggle extension"
    }
  }
}
```

## 🏗️ Development Workflow

### Watch Mode

During development, run:

```bash
npm run dev
```

This builds the extension with source maps and watches for changes.

### Testing Changes

After making changes:
1. Save your files
2. Run `npm run build` (or `npm run dev`)
3. Go to `chrome://extensions/`
4. Click the refresh icon ↻ on your extension card
5. Test the changes

### Debugging

- **Popup:** Right-click the popup and select "Inspect"
- **Options Page:** Right-click the options page and select "Inspect"
- **Background Script:** Click "Inspect views: background page" on `chrome://extensions/`
- **Content Script:** Open DevTools on any page where it runs (F12)

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder with:
- Minified code
- No source maps
- Optimized assets
- Production React build

### Prepare for Chrome Web Store

1. Build the extension: `npm run build`
2. Test the production build thoroughly
3. Create a ZIP file of the `dist` folder:
   ```bash
   cd dist
   zip -r ../extension.zip *
   cd ..
   ```
4. Create icons in multiple sizes (16, 32, 48, 128px)
5. Prepare store listing materials:
   - Screenshots (1280x800 or 640x400)
   - Promotional images (440x280)
   - Description and privacy policy

## 🚀 Publishing to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the one-time $5 developer fee (if not already paid)
3. Click "New Item"
4. Upload your `extension.zip` file
5. Fill in the store listing:
   - Name and description
   - Category
   - Screenshots
   - Icons
   - Privacy policy (if collecting user data)
6. Submit for review

**Review time:** Usually 1-3 days

## 🔒 Privacy & Security

- This extension uses Chrome Storage API for local data only
- No external servers or data collection
- No tracking or analytics by default
- All data stays on the user's device
- Synced settings use Chrome's built-in sync (if enabled)

If you add data collection or external API calls, you **must**:
1. Update the privacy policy
2. Disclose data usage in the store listing
3. Request appropriate permissions

## 🐛 Troubleshooting

### Extension not loading
- Check that you selected the `dist` folder, not the project root
- Ensure `manifest.json` exists in `dist/`
- Check browser console for errors

### Content script not running
- Verify the `matches` pattern in `manifest.json`
- Check that the page URL matches the pattern
- Look for errors in the page's DevTools console

### Storage not working
- Ensure `storage` permission is in `manifest.json`
- Check Chrome storage quota limits (5MB for sync, 10MB for local)

### Build errors
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Check Node.js version (v18+ recommended)

## 📚 Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

This is your project! Customize it as needed:
- Add new features
- Improve the UI
- Add more utilities
- Integrate with external APIs
- Share with the community

## 📄 License

MIT License - Feel free to use this template for your projects!

## 💡 Tips

1. **Keep the background script lightweight** - Service workers can be terminated by Chrome at any time
2. **Use storage for persistence** - Don't rely on in-memory state in background scripts
3. **Handle errors gracefully** - Chrome APIs can fail; always add error handling
4. **Test on multiple sites** - Content scripts behavior can vary across websites
5. **Monitor permissions** - Only request permissions you actually use
6. **Optimize bundle size** - Smaller extensions load faster
7. **Follow Chrome Web Store policies** - Read guidelines before publishing

## 🎉 What's Next?

Now that you have a working Chrome extension:
- [ ] Customize the UI to match your brand
- [ ] Add your own features and logic
- [ ] Test thoroughly on different websites
- [ ] Add proper error handling
- [ ] Create good documentation
- [ ] Publish to Chrome Web Store
- [ ] Gather user feedback
- [ ] Iterate and improve!

Happy coding! 🚀
