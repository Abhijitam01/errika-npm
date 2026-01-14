# ✨ create-errika

> A powerful CLI to instantly scaffold modern projects with multiple professional templates. Skip the setup — start building.

[![npm version](https://img.shields.io/npm/v/create-errika)](https://www.npmjs.com/package/create-errika)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 What is Errika?

**Errika 2.0** is an interactive CLI that creates production-ready projects with your choice of modern technology stacks. Choose from **5 professional templates** covering full-stack applications, monorepos, Discord bots, and browser extensions.

---

## 📦 Quick Start

Run the interactive CLI:

```bash
npx create-errika@latest
```

You'll be guided through an interactive setup to:
1. **Choose your template** - 5 options available
2. **Name your project**
3. **Select package manager** - npm, yarn, pnpm, or bun
4. **Configure template options** (template-specific)
5. **Initialize git repository** (optional)

---

## 🎯 Available Templates

### 1. 🏗️ Turborepo Monorepo
**Best for:** Large-scale applications with shared code

**Features:**
- Turborepo for build orchestration
- Multiple backends (HTTP + WebSocket)
- Choice of frontend (Next.js, React, or React Native)
- Shared UI components library
- Shared ESLint and TypeScript configs
- pnpm/bun workspaces

**Package Managers:** pnpm, bun

**Structure:**
```
your-project/
├── apps/
│   ├── web/mobile    # Your frontend
│   ├── http-backend  # Express.js API
│   └── ws-backend    # WebSocket server
└── packages/
    ├── ui            # Shared React components
    ├── eslint-config
    └── typescript-config
```

---

### 2. ⚡ Next.js Full-Stack
**Best for:** Modern web applications with SSR

**Features:**
- Next.js 15 with App Router
- React 19
- Tailwind CSS for styling
- TypeScript throughout
- API routes for backend
- Example components and layouts

**Package Managers:** npm, yarn, pnpm, bun

**Structure:**
```
your-project/
├── app/          # Next.js App Router
├── components/   # React components
├── lib/          # Utilities
└── public/       # Static assets
```

**Ports:** 3000 (dev server)

---

### 3. 🔄 Express + React
**Best for:** Full-stack apps with separate frontend/backend

**Features:**
- Express.js REST API
- React 19 with Vite
- pnpm workspace monorepo
- Shared TypeScript types
- CORS configured
- Hot reload for both frontend and backend

**Package Managers:** pnpm, npm, yarn

**Structure:**
```
your-project/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── package.json
```

**Ports:** 
- Frontend: 3000
- Backend API: 3001

---

### 4. 🤖 Discord Bot
**Best for:** Discord bot development

**Features:**
- discord.js v14
- Slash commands handler
- Event system
- Command registry
- TypeScript
- Hot reload in development

**Package Managers:** npm, yarn, pnpm, bun

**Structure:**
```
your-project/
├── src/
│   ├── commands/     # Slash commands
│   ├── events/       # Event handlers
│   ├── utils/        # Helper functions
│   └── index.ts      # Bot entry point
└── .env.example
```

**Example Commands:** `/ping`, `/info`

---

### 5. 🧩 Chrome Extension
**Best for:** Browser extension development

**Features:**
- Manifest V3
- React 19 for UI components
- TypeScript
- Vite for fast builds
- Background service worker
- Content scripts support
- Chrome Storage API integration
- Hot reload in development

**Package Managers:** npm, yarn, pnpm, bun

**Structure:**
```
your-project/
├── src/
│   ├── background/   # Service worker
│   ├── content/      # Content scripts
│   ├── popup/        # Extension popup (React)
│   └── options/      # Options page (React)
├── public/
│   ├── icons/
│   └── manifest.json
└── package.json
```

---

## 💡 Examples

### Create a Next.js project in current directory

```bash
npx create-errika@latest
# Select "Next.js Full-Stack"
# Enter "." as project name
# Choose your package manager
```

### Create a Discord bot

```bash
npx create-errika@latest
# Select "Discord Bot"
# Enter your project name
# Configure .env with your bot token
```

### Create a Turborepo monorepo with React Native

```bash
npx create-errika@latest
# Select "Turborepo Monorepo"
# Choose "React Native" for frontend
# Select pnpm or bun
```

---

## 📊 Usage Statistics & Analytics

Errika includes **optional** anonymous usage analytics to help improve the tool. You'll be asked for consent on first use.

### What We Track (With Your Consent)
- Template name (e.g., "nextjs", "turborepo")
- Success/failure status
- Timestamp
- Node.js version
- Package manager used

### What We DON'T Track
- ❌ Project names or paths
- ❌ Personal information
- ❌ Code or file contents
- ❌ Any sensitive data

### View Your Stats
```bash
npx create-errika stats
```

### Manage Analytics
```bash
# Check status
npx create-errika analytics status

# Enable/disable
npx create-errika analytics enable
npx create-errika analytics disable

# Remove all data
npx create-errika analytics reset
```

**Privacy First:** See our detailed [Privacy Policy](../PRIVACY.md) for complete information.

---

## 🛠️ Common Commands

After creating your project, navigate to it and use these commands:

### Development
```bash
pnpm dev        # Start development server(s)
pnpm build      # Build for production
pnpm start      # Start production server
```

### Turborepo-specific
```bash
pnpm dev        # Start all apps in parallel
pnpm lint       # Lint all apps and packages
pnpm clean      # Clean all build outputs
```

### Discord Bot-specific
```bash
pnpm deploy-commands  # Register slash commands
pnpm dev             # Start bot with hot reload
```

### Chrome Extension-specific
```bash
pnpm build      # Build extension
pnpm dev        # Development mode with HMR
# Then load 'dist' folder in chrome://extensions/
```

---

## 🔒 Security Features

Errika implements **enterprise-grade security** with multiple layers of protection:

- ✅ **Path traversal prevention** - Validates all file paths
- ✅ **Package manager validation** - Runtime checks for allowed package managers
- ✅ **Input sanitization** - Project names validated against reserved words and malicious patterns
- ✅ **Package manager existence check** - Verifies installation before proceeding
- ✅ **Defense-in-depth strategy** - Multiple validation layers

See [SECURITY_ENHANCEMENTS.md](SECURITY_ENHANCEMENTS.md) for details.

---

## 📚 Tech Stack

### Core
- **TypeScript** - Type-safe development
- **Commander.js** - CLI framework
- **Prompts** - Interactive user input
- **Chalk** - Colored terminal output
- **Ora** - Loading spinners
- **fs-extra** - Enhanced file operations
- **Handlebars** - Template processing

### Templates Include
- **Turborepo** - Monorepo build system
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with new features
- **Vite** - Lightning-fast build tool
- **Express.js** - Web framework for Node.js
- **discord.js v14** - Discord API wrapper
- **Tailwind CSS** - Utility-first CSS
- **Chrome Extensions API** - Browser extension development

---

## 🎯 Use Cases

| Template | Best For |
|----------|----------|
| **Turborepo** | Large applications, microservices, shared component libraries |
| **Next.js** | SEO-focused websites, full-stack web apps, serverless applications |
| **Express + React** | Traditional client-server architecture, REST APIs |
| **Discord Bot** | Discord automation, community bots, slash commands |
| **Chrome Extension** | Browser automation, productivity tools, content enhancement |

---

## 🧪 Testing

Errika includes a comprehensive test suite with high coverage:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Generate coverage report
pnpm test:coverage
```

**Test Coverage:**
- ✅ Unit tests for all generators and utilities
- ✅ Integration tests for full project generation
- ✅ Error handling and edge cases
- ✅ Template placeholder replacement
- ✅ Cross-platform compatibility (Windows, macOS, Linux)

See [TEST_COVERAGE.md](TEST_COVERAGE.md) for detailed coverage information.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new templates
- Submit pull requests
- Improve documentation

**Before submitting:**
1. Run tests: `pnpm test`
2. Build the project: `pnpm build`
3. Ensure code passes linting

---

## 📝 License

MIT © [Abhijit Mishra](https://github.com/Abhijitam01)

---

## 🔗 Links

- **GitHub**: [errika-npm](https://github.com/Abhijitam01/errika-npm)
- **npm**: [@create-errika](https://www.npmjs.com/package/create-errika)

---

## ⭐ Show Your Support

If you find Errika useful, please give it a ⭐ on [GitHub](https://github.com/Abhijitam01/errika-npm)!

---

**Happy coding! 🎉**
