'use client'

import { Search, Lightbulb, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">xxit</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-300 text-sm mb-6">
            <Lightbulb className="w-4 h-4 mr-2" />
            AI-Powered Project Discovery
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Discover Your Next
            <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent"> SaaS Product</span>
          </h1>

          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Input your concept, and let our intelligent system suggest unique, scalable SaaS project ideas.
          </p>
        </div>

        {/* Input (non-functional) */}
        <div className="mb-20">
          <form className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Try: HR automation, crypto, fitness, etc..."
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none"
                      disabled
                    />
                  </div>
                  <button
                    type="submit"
                    disabled
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl opacity-50 cursor-not-allowed flex items-center space-x-2 text-lg"
                  >
                    <span>Generate Ideas</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Insights</h3>
            <p className="text-gray-400">Leverage real-time data to discover project gaps in the market.</p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Unique SaaS Ideas</h3>
            <p className="text-gray-400">Generate innovative product concepts tailored to niche industries.</p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fast & Reliable</h3>
            <p className="text-gray-400">No fluff—just actionable ideas, delivered in seconds.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 xxit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
