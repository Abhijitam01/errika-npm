import Link from 'next/link'
import { Github, Twitter, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="text-xl font-bold text-white">Errika</span>
            </div>
            <p className="text-sm text-gray-400">
              Generate production-ready projects in seconds. Modern templates for every need.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername/errika"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/errikadev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Templates */}
          <div>
            <h3 className="text-white font-semibold mb-4">Templates</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/templates/nextjs" className="hover:text-primary-500 transition-colors">Next.js</Link></li>
              <li><Link href="/templates/turborepo" className="hover:text-primary-500 transition-colors">Turborepo</Link></li>
              <li><Link href="/templates/express-react" className="hover:text-primary-500 transition-colors">Express + React</Link></li>
              <li><Link href="/templates/discord-bot" className="hover:text-primary-500 transition-colors">Discord Bot</Link></li>
              <li><Link href="/templates/chrome-extension" className="hover:text-primary-500 transition-colors">Chrome Extension</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="hover:text-primary-500 transition-colors">Documentation</Link></li>
              <li><Link href="/docs/getting-started" className="hover:text-primary-500 transition-colors">Getting Started</Link></li>
              <li><Link href="/showcase" className="hover:text-primary-500 transition-colors">Showcase</Link></li>
              <li><Link href="/community" className="hover:text-primary-500 transition-colors">Community</Link></li>
              <li><Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-500 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Errika. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

