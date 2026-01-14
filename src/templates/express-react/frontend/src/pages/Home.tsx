import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to {{projectName}}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A full-stack application built with Express.js, React, TypeScript, and Prisma.
          Start building your next great app today!
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/items"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Items
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="p-6 border rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast & Modern</h3>
          <p className="text-gray-600">
            Built with the latest technologies for optimal performance and developer experience.
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure</h3>
          <p className="text-gray-600">
            JWT authentication, password hashing, and secure API endpoints out of the box.
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Type Safe</h3>
          <p className="text-gray-600">
            Full TypeScript support from frontend to backend with Prisma for database types.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Express.js', 'React 18', 'TypeScript', 'Prisma', 'Vite', 'Tailwind CSS', 'JWT', 'Zod'].map(
            (tech) => (
              <div key={tech} className="p-4 bg-gray-50 rounded-lg text-center font-medium">
                {tech}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

