export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">
          {{portfolioName}}
        </h1>
        <p className="text-2xl mb-8">
          Full-Stack Developer & Designer
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#projects"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
}

