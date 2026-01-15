import Link from 'next/link'
import { BookOpen, Rocket, Code2, Zap, Package, Settings } from 'lucide-react'

const docCategories = [
  {
    title: 'Getting Started',
    icon: Rocket,
    description: 'Learn the basics and create your first project',
    links: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
      { title: 'CLI Usage', href: '/docs/cli-usage' },
    ],
  },
  {
    title: 'Templates',
    icon: Package,
    description: 'Detailed guides for each template',
    links: [
      { title: 'Next.js Template', href: '/docs/templates/nextjs' },
      { title: 'Turborepo Template', href: '/docs/templates/turborepo' },
      { title: 'Express + React', href: '/docs/templates/express-react' },
      { title: 'Discord Bot', href: '/docs/templates/discord-bot' },
      { title: 'Chrome Extension', href: '/docs/templates/chrome-extension' },
    ],
  },
  {
    title: 'Guides',
    icon: BookOpen,
    description: 'Step-by-step tutorials and best practices',
    links: [
      { title: 'Deployment Guide', href: '/docs/guides/deployment' },
      { title: 'Environment Variables', href: '/docs/guides/environment' },
      { title: 'Database Setup', href: '/docs/guides/database' },
      { title: 'Authentication', href: '/docs/guides/authentication' },
    ],
  },
  {
    title: 'Configuration',
    icon: Settings,
    description: 'Customize your projects',
    links: [
      { title: 'TypeScript Config', href: '/docs/config/typescript' },
      { title: 'Tailwind Setup', href: '/docs/config/tailwind' },
      { title: 'ESLint Rules', href: '/docs/config/eslint' },
      { title: 'Package Managers', href: '/docs/config/package-managers' },
    ],
  },
  {
    title: 'Advanced',
    icon: Code2,
    description: 'Advanced features and customization',
    links: [
      { title: 'Custom Templates', href: '/docs/advanced/custom-templates' },
      { title: 'Template Structure', href: '/docs/advanced/template-structure' },
      { title: 'Contributing', href: '/docs/advanced/contributing' },
      { title: 'API Reference', href: '/docs/advanced/api-reference' },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: Zap,
    description: 'Common issues and solutions',
    links: [
      { title: 'Common Errors', href: '/docs/troubleshooting/common-errors' },
      { title: 'FAQ', href: '/docs/troubleshooting/faq' },
      { title: 'Support', href: '/docs/troubleshooting/support' },
    ],
  },
]

export const metadata = {
  title: 'Documentation - Errika',
  description: 'Complete documentation for Errika templates',
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know to build amazing projects with Errika
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
            />
            <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Documentation Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.title}
                className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm flex items-center"
                      >
                        <span className="mr-2">→</span>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-16 glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/docs/quick-start"
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Rocket className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Quick Start Guide</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get started in 5 minutes</div>
              </div>
            </Link>
            <Link
              href="/docs/templates/nextjs"
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Package className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Next.js Template</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Most popular template</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}



