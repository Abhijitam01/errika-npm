# ✨ create-errika

> A CLI tool to instantly scaffold a Turborepo-based monorepo with multiple frontend options and package managers. Skip the setup — start building.

---

## 🚀 What is this?

`create-errika` is an interactive CLI that creates a ready-to-use monorepo setup powered by [Turborepo](https://turbo.build). Choose your preferred package manager (pnpm or bun) and frontend framework (Next.js, React, or React Native).

---

## 📦 Features

- 🎯 **Interactive Setup** - Guided prompts for project configuration
- 📱 **Multiple Frontend Options**:
  - Next.js (SSR React Framework)
  - React (Vite SPA)
  - React Native (Mobile)
- 📦 **Package Manager Choice** - Use pnpm or bun
- 🏗️ **Pre-configured Monorepo**:
  - HTTP Backend
  - WebSocket Backend
  - Shared UI components
  - TypeScript & ESLint configs
- ⚡ Automatic dependency installation
- 💡 Clean DX-focused starter — minimal, fast, extensible

---

## 📥 Usage

Run the interactive CLI:

```bash
npx create-errika@latest
```

You'll be prompted to:
1. **Enter project name** - Name your project (or use "." for current directory)
2. **Choose package manager** - Select pnpm (recommended) or bun
3. **Select frontend type** - Pick Next.js, React (Vite), or React Native

---

## 📁 What's Inside?

After scaffolding, your project will have:

### Apps
- **web** or **mobile** - Your chosen frontend application
- **http-backend** - Express/Node.js HTTP server
- **ws-backend** - WebSocket server

### Packages
- **@repo/ui** - Shared React component library
- **@repo/eslint-config** - Shared ESLint configurations
- **@repo/typescript-config** - Shared TypeScript configurations

---

## 🚀 Getting Started

After creation, navigate to your project and start developing:

```bash
cd my-app

# Start all apps in development mode
pnpm dev

# Or with bun
bun dev
```

---

## 📚 Available Scripts

In the project root:

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all apps and packages
- `pnpm clean` - Clean all build outputs

---

## 🛠️ Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm or bun
- **Language**: TypeScript
- **Frontend Options**:
  - Next.js 15 (React 19)
  - Vite + React 19
  - React Native 0.76
- **Backend**: Node.js
- **Linting**: ESLint
- **Styling**: CSS (customizable)

---

## 📖 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [React Native Documentation](https://reactnative.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Happy coding! 🎉**
