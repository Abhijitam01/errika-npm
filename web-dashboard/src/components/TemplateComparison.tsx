'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRight, Plus } from 'lucide-react'

interface TemplateData {
  id: string
  name: string
  icon: string
  category: string
  difficulty: string
  features: {
    [key: string]: boolean | string
  }
}

const allTemplates: TemplateData[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '⚡',
    category: 'Web',
    difficulty: 'Intermediate',
    features: {
      'TypeScript': true,
      'React': true,
      'Server Components': true,
      'API Routes': true,
      'Database ORM': 'Prisma',
      'Styling': 'Tailwind CSS',
      'Authentication': true,
      'File-based Routing': true,
      'SSR/SSG': true,
      'Hot Reload': true,
      'Testing': 'Vitest',
      'Deployment': 'Vercel',
      'Monorepo': false,
      'Mobile Support': false,
    },
  },
  {
    id: 'turborepo',
    name: 'Turborepo',
    icon: '🏗️',
    category: 'Monorepo',
    difficulty: 'Advanced',
    features: {
      'TypeScript': true,
      'React': true,
      'Server Components': true,
      'API Routes': true,
      'Database ORM': 'Prisma',
      'Styling': 'Tailwind CSS',
      'Authentication': false,
      'File-based Routing': true,
      'SSR/SSG': true,
      'Hot Reload': true,
      'Testing': 'Vitest',
      'Deployment': 'Multiple',
      'Monorepo': true,
      'Mobile Support': 'React Native',
    },
  },
  {
    id: 'express-react',
    name: 'Express + React',
    icon: '🚀',
    category: 'Full-Stack',
    difficulty: 'Beginner',
    features: {
      'TypeScript': true,
      'React': true,
      'Server Components': false,
      'API Routes': 'Express',
      'Database ORM': false,
      'Styling': 'Tailwind CSS',
      'Authentication': false,
      'File-based Routing': false,
      'SSR/SSG': false,
      'Hot Reload': true,
      'Testing': false,
      'Deployment': 'Railway',
      'Monorepo': false,
      'Mobile Support': false,
    },
  },
  {
    id: 'discord-bot',
    name: 'Discord Bot',
    icon: '🤖',
    category: 'Bot',
    difficulty: 'Beginner',
    features: {
      'TypeScript': true,
      'React': false,
      'Server Components': false,
      'API Routes': false,
      'Database ORM': false,
      'Styling': false,
      'Authentication': false,
      'File-based Routing': false,
      'SSR/SSG': false,
      'Hot Reload': true,
      'Testing': false,
      'Deployment': 'Railway',
      'Monorepo': false,
      'Mobile Support': false,
    },
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extension',
    icon: '🔌',
    category: 'Extension',
    difficulty: 'Intermediate',
    features: {
      'TypeScript': true,
      'React': true,
      'Server Components': false,
      'API Routes': false,
      'Database ORM': false,
      'Styling': 'CSS Modules',
      'Authentication': false,
      'File-based Routing': false,
      'SSR/SSG': false,
      'Hot Reload': true,
      'Testing': false,
      'Deployment': 'Chrome Store',
      'Monorepo': false,
      'Mobile Support': false,
    },
  },
]

const featureCategories = {
  'Core Technologies': ['TypeScript', 'React', 'Server Components'],
  'Backend': ['API Routes', 'Database ORM'],
  'Frontend': ['Styling', 'File-based Routing', 'SSR/SSG'],
  'Development': ['Hot Reload', 'Testing'],
  'Infrastructure': ['Authentication', 'Deployment', 'Monorepo', 'Mobile Support'],
}

export function TemplateComparison() {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['nextjs', 'turborepo'])

  const toggleTemplate = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      if (selectedTemplates.length > 1) {
        setSelectedTemplates(selectedTemplates.filter(id => id !== templateId))
      }
    } else {
      if (selectedTemplates.length < 3) {
        setSelectedTemplates([...selectedTemplates, templateId])
      }
    }
  }

  const comparedTemplates = selectedTemplates.map(id => 
    allTemplates.find(t => t.id === id)!
  )

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto" />
      )
    }
    return <span className="text-sm text-gray-900 dark:text-white font-medium">{value}</span>
  }

  return (
    <div className="space-y-8">
      {/* Template Selector */}
      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Select Templates to Compare (up to 3)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {allTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => toggleTemplate(template.id)}
              disabled={!selectedTemplates.includes(template.id) && selectedTemplates.length >= 3}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                selectedTemplates.includes(template.id)
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              } ${
                !selectedTemplates.includes(template.id) && selectedTemplates.length >= 3
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <span className="text-3xl mb-2">{template.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {template.name}
              </span>
              {selectedTemplates.includes(template.id) && (
                <Check className="w-4 h-4 text-primary-600 mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white w-64">
                  Feature
                </th>
                {comparedTemplates.map(template => (
                  <th key={template.id} className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-3xl">{template.icon}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {template.difficulty}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(featureCategories).map(([category, features]) => (
                <>
                  <tr key={category} className="bg-gray-50 dark:bg-gray-800/50">
                    <td colSpan={comparedTemplates.length + 1} className="px-6 py-3">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {category}
                      </span>
                    </td>
                  </tr>
                  {features.map(feature => (
                    <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </td>
                      {comparedTemplates.map(template => (
                        <td key={template.id} className="px-6 py-4 text-center">
                          {renderFeatureValue(template.features[feature])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparedTemplates.map(template => {
          const trueFeatures = Object.values(template.features).filter(v => v === true || (typeof v === 'string' && v.length > 0)).length
          const totalFeatures = Object.keys(template.features).length
          
          return (
            <div key={template.id} className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{template.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.category}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Features</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {trueFeatures}/{totalFeatures}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                  <span className={`font-semibold ${
                    template.difficulty === 'Beginner' ? 'text-green-600' :
                    template.difficulty === 'Intermediate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Best For</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {template.category}
                  </span>
                </div>
              </div>

              <Link
                href={`/templates/${template.id}`}
                className="mt-6 w-full flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Help Section */}
      <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Need Help Choosing?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Beginners</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Start with <strong>Express + React</strong> or <strong>Discord Bot</strong>. These templates are simpler and easier to understand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Production Apps</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Choose <strong>Next.js</strong> for full-stack web apps with modern features and best performance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Large Teams</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Use <strong>Turborepo</strong> to manage multiple applications and shared packages in a monorepo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Browser Tools</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Build with <strong>Chrome Extension</strong> template for creating powerful browser extensions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

