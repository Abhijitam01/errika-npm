'use client'

import Link from 'next/link'
import { ArrowRight, Star, Download, TrendingUp } from 'lucide-react'

const templates = [
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Full-stack Next.js 14 with App Router, TypeScript, Tailwind CSS, and Prisma',
    tags: ['React', 'TypeScript', 'Tailwind', 'Prisma'],
    stars: 1234,
    downloads: 5678,
    color: 'from-blue-500 to-cyan-500',
    icon: '⚡',
  },
  {
    id: 'turborepo',
    name: 'Turborepo Monorepo',
    description: 'Complete monorepo setup with Next.js, React, React Native, and shared packages',
    tags: ['Monorepo', 'Next.js', 'React', 'React Native'],
    stars: 987,
    downloads: 3456,
    color: 'from-purple-500 to-pink-500',
    icon: '🏗️',
  },
  {
    id: 'express-react',
    name: 'Express + React',
    description: 'Full-stack Express backend with React frontend, TypeScript throughout',
    tags: ['Express', 'React', 'TypeScript', 'REST API'],
    stars: 876,
    downloads: 2345,
    color: 'from-green-500 to-emerald-500',
    icon: '🚀',
  },
  {
    id: 'discord-bot',
    name: 'Discord Bot',
    description: 'Production-ready Discord bot with slash commands, events, and TypeScript',
    tags: ['Discord.js', 'TypeScript', 'Bot'],
    stars: 765,
    downloads: 1890,
    color: 'from-indigo-500 to-purple-500',
    icon: '🤖',
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extension',
    description: 'Modern Chrome extension with React, TypeScript, and Vite for fast development',
    tags: ['Chrome', 'React', 'Vite', 'TypeScript'],
    stars: 654,
    downloads: 1567,
    color: 'from-yellow-500 to-orange-500',
    icon: '🔌',
  },
]

export function TemplateShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Templates
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Battle-tested templates used by thousands of developers to kickstart their projects
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template, index) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="group relative glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700 card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="text-5xl mb-4">{template.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {template.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{template.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Popular</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/templates"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
          >
            <span>View all templates</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

