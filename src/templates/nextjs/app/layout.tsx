import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '{{projectName}} - Next.js App',
  description: 'Built with Next.js 14, Tailwind CSS, and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {{projectName}}
                </h1>
                <div className="flex gap-4">
                  <a
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    Home
                  </a>
                  <a
                    href="/items"
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    Items
                  </a>
                </div>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                Built with ❤️ using{' '}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Next.js
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
