'use client'

import Link from 'next/link'
import { ArrowRight, Terminal, Zap, Code2 } from 'lucide-react'
import { useState, useEffect } from 'react'

const templates = ['Next.js', 'Turborepo', 'Discord Bot', 'Chrome Extension', 'Express + React']

export function HeroSection() {
  const [currentTemplate, setCurrentTemplate] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemplate((prev) => (prev + 1) % templates.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-white dark:from-gray-900 dark:via-primary-950/30 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-200"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800">
            <Zap className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ⚡ Lightning-fast project generation
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
            Build <span className="gradient-text">production-ready</span>
            <br />
            projects in seconds
          </h1>

          {/* Dynamic subtitle */}
          <div className="flex items-center justify-center space-x-3 text-2xl sm:text-3xl text-gray-600 dark:text-gray-400">
            <span>Generate a</span>
            <span className="font-bold text-primary-600 dark:text-primary-400 min-w-[200px] text-left transition-all duration-300">
              {templates[currentTemplate]}
            </span>
            <span>app</span>
          </div>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Modern, well-architected templates with TypeScript, best practices, and everything you need to start building immediately.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="group gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Generate Online</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/templates"
              className="glass border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Code2 className="w-5 h-5" />
              <span>Browse Templates</span>
            </Link>
          </div>

          {/* Terminal preview */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="glass rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">
                  Terminal
                </div>
              </div>
              <div className="bg-gray-900 p-6 font-mono text-sm">
                <div className="flex items-center space-x-2 text-green-400">
                  <Terminal className="w-4 h-4" />
                  <span>$ npx create-errika my-project</span>
                </div>
                <div className="mt-2 text-gray-400">
                  <div className="typing-animation">✨ Generating your project...</div>
                  <div className="mt-1">📦 Installing dependencies...</div>
                  <div className="mt-1">🎉 Done! Your project is ready.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

