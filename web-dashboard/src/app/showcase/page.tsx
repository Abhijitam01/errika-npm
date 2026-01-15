import { CommunityShowcase } from '@/components/CommunityShowcase'

export const metadata = {
  title: 'Showcase - Errika',
  description: 'Amazing projects built with Errika templates',
}

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Community Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover amazing projects built with Errika templates
          </p>
        </div>
        <CommunityShowcase />
      </div>
    </div>
  )
}



