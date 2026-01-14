'use client'

import { useState } from 'react'
import { Download, Loader2, Check, AlertCircle, Sparkles } from 'lucide-react'

const templates = [
  { id: 'nextjs', name: 'Next.js', icon: '⚡' },
  { id: 'turborepo', name: 'Turborepo Monorepo', icon: '🏗️' },
  { id: 'express-react', name: 'Express + React', icon: '🚀' },
  { id: 'discord-bot', name: 'Discord Bot', icon: '🤖' },
  { id: 'chrome-extension', name: 'Chrome Extension', icon: '🔌' },
]

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export function OnlineGenerator() {
  const [projectName, setProjectName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [packageManager, setPackageManager] = useState('npm')
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleGenerate = async () => {
    if (!projectName || !selectedTemplate) {
      setErrorMessage('Please fill in all required fields')
      return
    }

    setStatus('generating')
    setErrorMessage('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          template: selectedTemplate,
          packageManager,
        }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      // Get the blob from response
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setStatus('success')
      
      // Track download
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          event: 'download',
        }),
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800 mb-6">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No CLI required
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Generate Online
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Create and download your project directly from your browser
        </p>
      </div>

      {/* Generator Form */}
      <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-project"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use lowercase letters, numbers, and hyphens
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Template <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <span className="text-3xl">{template.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </span>
                  {selectedTemplate === template.id && (
                    <Check className="ml-auto w-5 h-5 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Package Manager */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Package Manager
            </label>
            <div className="flex space-x-3">
              {['npm', 'yarn', 'pnpm'].map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPackageManager(pm)}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                    packageManager === pm
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span>Project generated successfully! Check your downloads.</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={status === 'generating'}
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold text-lg transition-all ${
              status === 'generating'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'gradient-bg text-white hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {status === 'generating' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Generate & Download</span>
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> After downloading, extract the ZIP file and run{' '}
            <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded">
              {packageManager} install
            </code>{' '}
            to install dependencies.
          </p>
        </div>
      </div>

      {/* CLI Alternative */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Prefer the command line?
        </p>
        <div className="glass rounded-lg p-4 border border-gray-200 dark:border-gray-700 inline-block">
          <code className="text-sm font-mono text-gray-900 dark:text-white">
            npx create-errika {projectName || 'my-project'}
          </code>
        </div>
      </div>
    </div>
  )
}

