export function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to GC React Scaffold
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            A Docker-based React + Tailwind CSS scaffold
          </p>
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Features
            </h2>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Docker containers for development and production
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Hot module replacement with Vite
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Tailwind CSS for styling
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                TypeScript for type safety
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Playwright for E2E testing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Storybook for component development
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

