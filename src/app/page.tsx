'use client'

import { useState } from 'react'
import { Search, Lightbulb, Sparkles, ArrowRight, UserPlus, Loader2, ExternalLink, Clock, Zap } from 'lucide-react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

interface ProjectIdea {
  idea: string
  description: string
  market_need: string
  tech_stack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimated_time: string
}

interface APIResponse {
  success: boolean
  data: {
    keywords: string[]
    projectIdeas: ProjectIdea[]
  }
  error?: string
}

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!inputValue.trim()) {
      setError('Please enter a concept to generate ideas')
      return
    }

    setIsLoading(true)
    setError('')
    setHasSearched(true)

    try {
      // Call Python backend instead of Node.js API
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue.trim() }),
      })

      const data: APIResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ideas')
      }

      if (data.success) {
        setProjectIdeas(data.data.projectIdeas)
        setKeywords(data.data.keywords)
      } else {
        throw new Error('API returned unsuccessful response')
      }

    } catch (err) {
      console.error('Error generating ideas:', err)
      
      // Check if it's a connection error
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the backend. Please try again later.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate ideas. Please try again.')
      }
      setProjectIdeas([])
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const features = [
    {
      icon: <Search className="w-7 h-7 text-white" />,
      title: 'Real-Time Market Research',
      desc: 'AI-powered web research to identify current market trends, opportunities, and gaps in real-time.',
    },
    {
      icon: <Lightbulb className="w-7 h-7 text-white" />,
      title: 'Intelligent Idea Generation',
      desc: 'Generate innovative, viable SaaS project ideas based on comprehensive market research and analysis.',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-white" />,
      title: 'Research-Backed Insights',
      desc: 'Every idea comes with detailed research sources, market analysis, and technical specifications.',
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
          </div>
        </div>
        
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <Lightbulb className="w-5 h-5 mr-2" />
            Powered by Perplexity AI Sonar & Next.js
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Discover Your Next Big
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              SaaS Product Idea
            </span>
          </h1>

          <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto">
            Transform your concepts into innovative SaaS solutions. Our AI-powered platform researches the web in real-time, 
            analyzes market trends, and generates viable project ideas with detailed research sources and technical specifications.
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
                    placeholder="Enter a concept: healthcare automation, fintech AI, remote work tools..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-slate-800 placeholder-slate-400 text-base focus:outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="px-5 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Ideas</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <strong>Error:</strong> {error}
              {error.includes('Python backend') && (
                <div className="mt-2 text-xs text-red-500">
                  To start the backend, run: <code className="bg-red-100 px-1 rounded">npm run dev</code>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="mb-16">
            {/* Keywords and Sources Info */}
            {keywords.length > 0 && (
              <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-900">AI-Extracted Keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
              </div>
            )}

            {/* Project Ideas */}
            {projectIdeas.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
                  AI-Generated Project Ideas
                </h2>
                {projectIdeas.map((idea, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 flex-1 pr-4">
                          {idea.idea}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(idea.difficulty)}`}>
                            {idea.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {idea.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                            <Search className="w-4 h-4 mr-1" />
                            Market Need
                          </h4>
                          <p className="text-sm text-slate-600">{idea.market_need}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Estimated Time
                          </h4>
                          <p className="text-sm text-slate-600">{idea.estimated_time}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          Suggested Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(idea.tech_stack || []).map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      
                    </div>
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-slate-600">Researching with Perplexity AI Sonar...</p>
                <p className="text-sm text-slate-500 mt-2">This may take 1-2 minutes for comprehensive research and idea generation</p>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p>🔍 Researching market trends and opportunities</p>
                  <p>💡 Generating innovative project ideas</p>
                  <p>📊 Analyzing market gaps and solutions</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Features Section */}
        {!hasSearched && (
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
        )}
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