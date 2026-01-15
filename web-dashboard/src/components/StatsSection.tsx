'use client'

import { useEffect, useState } from 'react'
import { Users, Download, Star, Code2 } from 'lucide-react'

const stats = [
  {
    icon: Download,
    label: 'Total Downloads',
    value: 15340,
    suffix: '+',
    color: 'text-primary-600',
  },
  {
    icon: Users,
    label: 'Active Users',
    value: 3250,
    suffix: '+',
    color: 'text-accent-600',
  },
  {
    icon: Star,
    label: 'GitHub Stars',
    value: 1890,
    suffix: '⭐',
    color: 'text-yellow-600',
  },
  {
    icon: Code2,
    label: 'Templates',
    value: 5,
    suffix: '',
    color: 'text-green-600',
  },
]

function CountUpAnimation({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

export function StatsSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  <CountUpAnimation end={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}



