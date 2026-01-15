import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, Star, TrendingUp, Github, ExternalLink, Play, CheckCircle } from 'lucide-react'
import { getTemplateById } from '@/lib/db/templates'

export async function generateStaticParams() {
  return [
    { id: 'nextjs' },
    { id: 'turborepo' },
    { id: 'express-react' },
    { id: 'discord-bot' },
    { id: 'chrome-extension' },
  ]
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const template = getTemplateById(params.id)
  
  if (!template) {
    return {
      title: 'Template Not Found - Errika',
    }
  }

  return {
    title: `${template.name} Template - Errika`,
    description: template.description,
  }
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const template = getTemplateById(params.id)

  if (!template) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/templates"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </Link>

        {/* Header */}
        <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-start space-x-4 mb-6 md:mb-0">
              <span className="text-6xl">{template.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 w-full md:w-auto">
              <Link
                href={`/generate?template=${template.id}`}
                className="flex items-center justify-center space-x-2 px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Generate Online</span>
              </Link>
              {template.githubUrl && (
                <a
                  href={template.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-yellow-600 mb-1">
                <Star className="w-5 h-5" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.stars.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stars</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-1">
                <Download className="w-5 h-5" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.downloads.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-primary-600 mb-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-purple-600 mb-1">
                {template.trending && <TrendingUp className="w-5 h-5" />}
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {template.longDescription}
              </p>
            </div>

            {/* Features */}
            <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.features.map(feature => (
                  <div key={feature} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Start
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm mr-3">1</span>
                    Generate your project
                  </h3>
                  <div className="ml-11 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span>npx create-errika my-project</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm mr-3">2</span>
                    Navigate to your project
                  </h3>
                  <div className="ml-11 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span>cd my-project</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm mr-3">3</span>
                    Start developing
                  </h3>
                  <div className="ml-11 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span>npm run dev</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Demo */}
            {template.demoUrl && (
              <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Live Demo
                </h3>
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>View Demo</span>
                </a>
              </div>
            )}

            {/* Video Tutorial */}
            {template.videoUrl && (
              <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Video Tutorial
                </h3>
                <a
                  href={template.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Tutorial</span>
                </a>
              </div>
            )}

            {/* Tech Stack */}
            <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Links */}
            <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Related
              </h3>
              <div className="space-y-3">
                <Link
                  href="/docs"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Documentation</span>
                </Link>
                <Link
                  href="/compare"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Compare Templates</span>
                </Link>
                <Link
                  href="/showcase"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Community Showcase</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



