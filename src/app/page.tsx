'use client'

import { useState } from 'react'
import { Search, Lightbulb, Sparkles, ArrowRight, UserPlus } from 'lucide-react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Submitted Concept:', inputValue)
  }

  const features = [
    {
      icon: <Search className="w-7 h-7 text-white" />,
      title: 'Smart Market Insights',
      desc: 'Access real-time market data to identify and validate untapped opportunities.',
    },
    {
      icon: <Lightbulb className="w-7 h-7 text-white" />,
      title: 'Unique SaaS Ideas',
      desc: 'Discover innovative and viable concepts tailored to specific niche industries.',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-white" />,
      title: 'Fast & Reliable',
      desc: 'Get actionable project ideas in seconds with our powerful AI-driven engine.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">xxit</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              About
            </a>
          </nav>
          <div className="flex items-center">
            {/* --- CLERK AUTHENTICATION --- */}
            <SignedOut>
              <div className="hidden sm:flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30">
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            {/* --- END CLERK AUTHENTICATION --- */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <Lightbulb className="w-5 h-5 mr-2" />
            AI-Powered Project Discovery
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Discover Your Next Big
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              SaaS Product Idea
            </span>
          </h1>

          <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto">
            Transform your concepts into innovative SaaS solutions. Our platform
            analyzes market trends to generate unique, viable project ideas for
            you.
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-24 max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 rounded-2xl"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl p-2 shadow-lg">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter a concept: HR automation, crypto, fitness..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-slate-800 placeholder-slate-400 text-base focus:outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  <span>Generate Ideas</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} xxit. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home