import Link from 'next/link'
import { ArrowRight, Terminal } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to build something amazing?
        </h2>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Join thousands of developers who are building faster with Errika. Get started in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/generate"
            className="group bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>Generate Online</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/getting-started"
            className="glass border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <Terminal className="w-5 h-5" />
            <span>View Documentation</span>
          </Link>
        </div>

        {/* CLI command */}
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between text-white font-mono">
              <span className="text-sm sm:text-base">
                <span className="text-white/60">$</span> npx create-errika my-project
              </span>
              <button
                onClick={() => navigator.clipboard.writeText('npx create-errika my-project')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



