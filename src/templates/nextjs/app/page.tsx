import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Database, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {{projectName}}
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A modern Next.js 14 application with App Router, Tailwind CSS, Prisma,
          and TypeScript. Production-ready and fully typed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/items">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold">Lightning Fast</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Built on Next.js 14 with App Router for optimal performance and SEO.
            Server Components by default.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold">Database Ready</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Integrated Prisma ORM with type-safe database access. Support for
            PostgreSQL, MySQL, SQLite, and MongoDB.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold">Type Safe</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Full TypeScript support with strict mode enabled. Zod for runtime
            validation.
          </p>
        </Card>
      </section>

      {/* Quick Start Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Start</h2>
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm text-gray-100">
              <div className="text-gray-400"># Install dependencies</div>
              <div>npm install</div>
              <div className="mt-2 text-gray-400"># Set up database</div>
              <div>npx prisma generate</div>
              <div>npx prisma db push</div>
              <div className="mt-2 text-gray-400"># Start development</div>
              <div>npm run dev</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check out the README.md file for detailed setup instructions and
              deployment guides.
            </p>
          </div>
        </Card>
      </section>

      {/* Tech Stack Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            'Next.js 14',
            'React 18',
            'TypeScript',
            'Tailwind CSS',
            'Prisma',
            'Zod',
            'ESLint',
            'Prettier',
          ].map((tech) => (
            <div
              key={tech}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
