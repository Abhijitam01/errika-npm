import { TemplateComparison } from '@/components/TemplateComparison'

export const metadata = {
  title: 'Compare Templates - Errika',
  description: 'Compare templates side by side to find the perfect fit',
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Compare Templates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find the perfect template by comparing features side-by-side
          </p>
        </div>
        <TemplateComparison />
      </div>
    </div>
  )
}

