// Template data structure and queries

export interface Template {
  id: string
  name: string
  description: string
  longDescription: string
  category: string
  tags: string[]
  stars: number
  downloads: number
  trending: boolean
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon: string
  features: string[]
  demoUrl?: string
  githubUrl?: string
  videoUrl?: string
}

export const templates: Template[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Full-stack Next.js 14 with App Router, TypeScript, Tailwind CSS, and Prisma',
    longDescription: 'A comprehensive Next.js template with everything you need to build modern web applications. Includes authentication, database setup, API routes, and more.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Prisma', 'PostgreSQL'],
    category: 'Web',
    stars: 1234,
    downloads: 5678,
    trending: true,
    difficulty: 'Intermediate',
    icon: '⚡',
    features: ['App Router', 'Server Components', 'API Routes', 'Database ORM', 'Authentication'],
    githubUrl: 'https://github.com/yourusername/errika',
  },
  {
    id: 'turborepo',
    name: 'Turborepo Monorepo',
    description: 'Complete monorepo setup with Next.js, React, React Native, and shared packages',
    longDescription: 'Enterprise-grade monorepo structure perfect for teams building multiple applications. Includes shared UI components, utilities, and configuration.',
    tags: ['Monorepo', 'Next.js', 'React', 'React Native', 'TypeScript'],
    category: 'Monorepo',
    stars: 987,
    downloads: 3456,
    trending: true,
    difficulty: 'Advanced',
    icon: '🏗️',
    features: ['Multiple Apps', 'Shared Packages', 'Turborepo', 'pnpm Workspaces', 'Remote Caching'],
  },
  {
    id: 'express-react',
    name: 'Express + React',
    description: 'Full-stack Express backend with React frontend, TypeScript throughout',
    longDescription: 'Traditional but powerful full-stack setup with Express.js backend and React frontend. Perfect for building RESTful APIs with a modern UI.',
    tags: ['Express', 'React', 'TypeScript', 'REST API', 'Node.js'],
    category: 'Full-Stack',
    stars: 876,
    downloads: 2345,
    trending: false,
    difficulty: 'Beginner',
    icon: '🚀',
    features: ['Express Backend', 'React Frontend', 'REST API', 'TypeScript', 'CORS Setup'],
  },
  {
    id: 'discord-bot',
    name: 'Discord Bot',
    description: 'Production-ready Discord bot with slash commands, events, and TypeScript',
    longDescription: 'Build powerful Discord bots with slash commands, event handlers, and proper error handling. Includes command deployment scripts and examples.',
    tags: ['Discord.js', 'TypeScript', 'Bot', 'Node.js'],
    category: 'Bot',
    stars: 765,
    downloads: 1890,
    trending: true,
    difficulty: 'Beginner',
    icon: '🤖',
    features: ['Slash Commands', 'Event Handlers', 'Command Registry', 'Error Handling', 'TypeScript'],
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extension',
    description: 'Modern Chrome extension with React, TypeScript, and Vite for fast development',
    longDescription: 'Build browser extensions with modern tooling. Includes popup, options page, content scripts, and background workers with hot reload.',
    tags: ['Chrome', 'React', 'Vite', 'TypeScript', 'Browser Extension'],
    category: 'Extension',
    stars: 654,
    downloads: 1567,
    trending: false,
    difficulty: 'Intermediate',
    icon: '🔌',
    features: ['Popup UI', 'Content Scripts', 'Background Worker', 'Options Page', 'Hot Reload'],
  },
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(t => t.category === category)
}

export function getTrendingTemplates(): Template[] {
  return templates.filter(t => t.trending)
}

export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase()
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

