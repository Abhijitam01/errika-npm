'use client'

import { useState } from 'react'
import { ExternalLink, Github, Heart, Filter, Plus } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: number
  name: string
  description: string
  template: string
  githubUrl: string
  liveUrl: string
  imageUrl: string
  author: {
    name: string
    avatar: string
  }
  likes: number
  featured: boolean
  tags: string[]
}

const projects: Project[] = [
  {
    id: 1,
    name: 'TaskFlow Pro',
    description: 'A modern task management app with real-time collaboration',
    template: 'nextjs',
    githubUrl: 'https://github.com/example/taskflow',
    liveUrl: 'https://taskflow.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    likes: 245,
    featured: true,
    tags: ['Next.js', 'Prisma', 'Real-time'],
  },
  {
    id: 2,
    name: 'DevHub',
    description: 'Developer portfolio and blog platform',
    template: 'nextjs',
    githubUrl: 'https://github.com/example/devhub',
    liveUrl: 'https://devhub.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
    likes: 189,
    featured: true,
    tags: ['Next.js', 'MDX', 'Portfolio'],
  },
  {
    id: 3,
    name: 'ShopifyBot',
    description: 'Discord bot for Shopify store notifications and management',
    template: 'discord-bot',
    githubUrl: 'https://github.com/example/shopifybot',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=600&fit=crop',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    },
    likes: 156,
    featured: false,
    tags: ['Discord', 'E-commerce', 'Automation'],
  },
  {
    id: 4,
    name: 'LinkSaver Extension',
    description: 'Save and organize links with tags and collections',
    template: 'chrome-extension',
    githubUrl: 'https://github.com/example/linksaver',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    author: {
      name: 'Emma Wilson',
      avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
    },
    likes: 134,
    featured: false,
    tags: ['Chrome', 'Productivity', 'React'],
  },
  {
    id: 5,
    name: 'Analytics Dashboard',
    description: 'Beautiful analytics dashboard with real-time data visualization',
    template: 'express-react',
    githubUrl: 'https://github.com/example/analytics',
    liveUrl: 'https://analytics.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    author: {
      name: 'David Kim',
      avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
    },
    likes: 198,
    featured: true,
    tags: ['Express', 'React', 'Charts'],
  },
  {
    id: 6,
    name: 'Enterprise Monorepo',
    description: 'Large-scale monorepo for multiple web and mobile apps',
    template: 'turborepo',
    githubUrl: 'https://github.com/example/enterprise',
    liveUrl: 'https://enterprise.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    author: {
      name: 'Lisa Anderson',
      avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
    },
    likes: 176,
    featured: false,
    tags: ['Turborepo', 'Monorepo', 'Enterprise'],
  },
]

const templates = ['All', 'nextjs', 'turborepo', 'express-react', 'discord-bot', 'chrome-extension']

export function CommunityShowcase() {
  const [selectedTemplate, setSelectedTemplate] = useState('All')
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set())

  const filteredProjects = selectedTemplate === 'All'
    ? projects
    : projects.filter(p => p.template === selectedTemplate)

  const toggleLike = (projectId: number) => {
    setLikedProjects(prev => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter by template:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map(template => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTemplate === template
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {template === 'All' ? 'All Templates' : template}
            </button>
          ))}
        </div>
        <button className="flex items-center space-x-2 px-6 py-2 gradient-bg text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          <span>Submit Project</span>
        </button>
      </div>

      {/* Featured Projects */}
      {selectedTemplate === 'All' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.filter(p => p.featured).map(project => (
              <div
                key={project.id}
                className="glass rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 card-hover"
              >
                <div className="relative h-64 bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={project.author.avatar}
                          alt={project.author.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {project.author.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Built with {project.template}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleLike(project.id)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          likedProjects.has(project.id)
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedProjects.has(project.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm">{project.likes + (likedProjects.has(project.id) ? 1 : 0)}</span>
                      </button>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Projects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {selectedTemplate === 'All' ? 'All Projects' : `${selectedTemplate} Projects`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="glass rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 card-hover"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src={project.author.avatar}
                        alt={project.author.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {project.author.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleLike(project.id)}
                      className={`flex items-center space-x-1 ${
                        likedProjects.has(project.id) ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedProjects.has(project.id) ? 'fill-current' : ''}`} />
                      <span>{project.likes + (likedProjects.has(project.id) ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

