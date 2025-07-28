'use client'

import { Search, Lightbulb, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">xxit</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mb-6">
            <Lightbulb className="w-4 h-4 mr-2" />
            AI-Powered Project Discovery
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turn Your Ideas Into
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Unique Projects</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Enter any concept and our advanced data scraping technology will generate personalized, 
            innovative project ideas tailored to your vision.
          </p>
        </div>

        {/* Input UI (non-functional) */}
        <div className="mb-16">
          <form className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter your concept, technology, or industry..."
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none"
                      disabled
                    />
                  </div>
                  <button
                    type="submit"
                    disabled
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl opacity-50 cursor-not-allowed flex items-center space-x-2 text-lg"
                  >
                    <span>Generate Ideas</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Feature Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Data Scraping</h3>
            <p className="text-gray-400">Advanced algorithms analyze web data to find trending opportunities</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Unique Ideas</h3>
            <p className="text-gray-400">Generate original project concepts tailored to your specific input</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-gray-400">Get multiple project ideas in seconds, not hours of research</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 xxit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
