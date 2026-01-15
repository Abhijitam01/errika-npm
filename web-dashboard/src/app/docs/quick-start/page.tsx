import { Terminal, Package, Play, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Quick Start - Errika Documentation',
  description: 'Get started with Errika in minutes',
}

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          <a href="/docs" className="hover:text-primary-600">Documentation</a>
          {' '}/{' '}
          <span>Quick Start</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Start Guide
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Get up and running with Errika in just a few minutes
        </p>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Terminal className="w-6 h-6 mr-2 text-primary-600" />
              Installation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Errika requires Node.js 18.0 or later. You can use it directly with npx without installing:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span>npx create-errika my-project</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Or install globally:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span>npm install -g create-errika</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Play className="w-6 h-6 mr-2 text-primary-600" />
              Creating a Project
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Step 1: Run the generator
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span>npx create-errika my-project</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  This will start the interactive prompt
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Step 2: Choose your template
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Select from available templates:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1 ml-4">
                  <li>Next.js - Full-stack web application</li>
                  <li>Turborepo - Monorepo setup</li>
                  <li>Express + React - Traditional full-stack</li>
                  <li>Discord Bot - Bot with slash commands</li>
                  <li>Chrome Extension - Browser extension</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Step 3: Select package manager
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose your preferred package manager (npm, yarn, or pnpm)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Step 4: Wait for generation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Errika will generate your project and install dependencies automatically
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Package className="w-6 h-6 mr-2 text-primary-600" />
              Running Your Project
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Navigate to your project directory:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span>cd my-project</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Start the development server:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span>npm run dev</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800 dark:text-green-300">
                    <strong>Success!</strong> Your project is now running. Open{' '}
                    <code className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 rounded">
                      http://localhost:3000
                    </code>{' '}
                    in your browser.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Next Steps
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold text-lg">1.</span>
                <div>
                  <a href="/docs/templates" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Explore template documentation
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Learn about the features and structure of your chosen template
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold text-lg">2.</span>
                <div>
                  <a href="/docs/guides/deployment" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Deploy your project
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Learn how to deploy to Vercel, Railway, or other platforms
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold text-lg">3.</span>
                <div>
                  <a href="/showcase" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Share your project
                  </a>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Show off what you built with Errika in our community showcase
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}



