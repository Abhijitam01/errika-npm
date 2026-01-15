'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, X, Star, Download, TrendingUp, ArrowRight } from 'lucide-react'

const allTemplates = [
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

const categories = ['All', 'Web', 'Full-Stack', 'Monorepo', 'Bot', 'Extension']
const technologies = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Express', 'Prisma', 'Tailwind', 'Discord.js', 'Vite', 'Chrome']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export function TemplateExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    
    const matchesTech = selectedTechs.length === 0 || 
                        selectedTechs.some(tech => template.tags.includes(tech))
    
    const matchesDifficulty = selectedDifficulty === 'All' || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesTech && matchesDifficulty
  })

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedTechs([])
    setSelectedDifficulty('All')
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar */}
      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {(selectedCategory !== 'All' || selectedTechs.length > 0 || selectedDifficulty !== 'All') && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {[selectedCategory !== 'All' ? 1 : 0, selectedTechs.length, selectedDifficulty !== 'All' ? 1 : 0].reduce((a, b) => a + b)}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Technology Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedTechs.includes(tech)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' || selectedTechs.length > 0 || selectedDifficulty !== 'All' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-gray-600 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredTemplates.length}</span> templates
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map(template => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="group glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700 card-hover"
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="text-5xl flex-shrink-0">{template.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {template.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          {template.difficulty}
                        </span>
                        {template.trending && (
                          <span className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>Trending</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.features.slice(0, 3).map(feature => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{template.stars.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}



