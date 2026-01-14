import { Zap, Shield, Code2, Palette, Rocket, Package } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate complete projects in seconds. No more hours of setup and configuration.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Built with best practices, security in mind, and optimized for performance.',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    icon: Code2,
    title: 'TypeScript First',
    description: 'Full TypeScript support with type safety and excellent IDE integration.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'Modern, responsive designs with Tailwind CSS and component libraries.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    icon: Rocket,
    title: 'Deploy Ready',
    description: 'Configured for Vercel, Railway, and other platforms. Deploy in one click.',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    icon: Package,
    title: 'Zero Config',
    description: 'Everything works out of the box. Start coding immediately, no setup needed.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Errika?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built by developers, for developers. Every template is crafted with care and attention to detail.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="relative glass rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

