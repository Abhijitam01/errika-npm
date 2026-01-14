# Errika Monorepo

This is an [Errika](https://www.npmjs.com/package/create-errika) project bootstrapped with Turborepo.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- **web** or **mobile** - Your frontend application (Next.js, React, or React Native)
- **http-backend** - HTTP server for REST APIs
- **ws-backend** - WebSocket server for real-time communication
- **@repo/ui** - A shared React component library
- **@repo/eslint-config** - Shared ESLint configurations
- **@repo/typescript-config** - Shared `tsconfig.json` files

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Turborepo](https://turbo.build/repo) for efficient monorepo management

## Getting Started

Install dependencies:

```bash
pnpm install
```

## Development

To develop all apps and packages, run the following command:

```bash
pnpm dev
```

This will start:
- Frontend app on `http://localhost:3000`
- HTTP backend (check the app for port configuration)
- WebSocket backend (check the app for port configuration)

## Build

To build all apps and packages:

```bash
pnpm build
```

## Lint

To lint all apps and packages:

```bash
pnpm lint
```

## Type Check

To run TypeScript type checking:

```bash
pnpm check-types
```

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```bash
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```bash
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

