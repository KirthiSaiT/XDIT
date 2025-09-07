'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Lightbulb, Sparkles, ArrowRight, UserPlus, Loader2, ExternalLink, Clock, Zap, Globe, History, DollarSign, Brain, FileText, Shield, Users2, Gavel, AlertTriangle, BarChart3, Target, Component, Share2, CheckCircle2, Star } from 'lucide-react'
import Image from 'next/image'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { HistorySidebar } from '@/components/ui/sidebar'
import { ProjectIdeaDisplay } from '@/types'

interface APIResponse {
  success: boolean
  data: {
    keywords: string[]
    projectIdeas: ProjectIdeaDisplay[]
  }
  error?: string
}

const Home: React.FC = () => {
  const { user, isLoaded } = useUser()
  const [inputValue, setInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdeaDisplay[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [, setSelectedHistoryIdea] = useState<ProjectIdeaDisplay | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!inputValue.trim()) {
      setError('Please enter a concept to generate ideas')
      return
    }

    if (!isLoaded) {
      setError('Loading authentication... Please try again.')
      return
    }

    if (!user) {
      setError('Please sign in to generate ideas')
      return
    }

    setIsLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue.trim() }),
      })

      const data: APIResponse = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please try signing in again.')
        }
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

  const handleSelectHistoryIdea = (idea: ProjectIdeaDisplay) => {
    setSelectedHistoryIdea(idea)
    setInputValue(idea.idea)
    setHasSearched(false)
    setProjectIdeas([])
    setKeywords([])
    setError('')
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
      desc: 'Advanced AI-powered web research to identify current market trends, opportunities, and gaps in real-time using Xdit intelligence.',
    },
    {
      icon: <Lightbulb className="w-7 h-7 text-white" />,
      title: 'Intelligent Idea Generation',
      desc: 'Generate innovative, viable SaaS project ideas based on comprehensive market research and Xdit AI analysis.',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-white" />,
      title: 'Research-Backed Insights',
      desc: 'Every idea comes with detailed research sources, market analysis, and technical specifications powered by Xdit.',
    },
  ]

  const CORE_FEATURES = [
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "AI-Powered Idea Generation",
      description: "Generate innovative SaaS project ideas using advanced AI research engine with real-time market analysis.",
      features: ["Real-time web research", "Market trend analysis", "Competitive landscape scanning", "Tech stack recommendations"]
    },
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "Comprehensive Business Planning",
      description: "Transform ideas into detailed business blueprints with technical specifications, market analysis, and financial projections.",
      features: ["Technical architecture design", "Market & revenue analysis", "Development roadmaps", "Risk assessment"]
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Patent & IP Analysis",
      description: "Analyze patent landscapes, identify IP opportunities, and protect your intellectual property with AI-powered research.",
      features: ["Patent conflict analysis", "IP protection strategies", "Trademark guidance", "Prior art research"]
    },
    {
      icon: <Users2 className="w-8 h-8 text-white" />,
      title: "Competitive Intelligence",
      description: "Get detailed competitor analysis, market positioning insights, and differentiation strategies for your industry.",
      features: ["Direct competitor identification", "Market gap analysis", "Positioning strategies", "Competitive advantages"]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-white" />,
      title: "Fundraising Strategy",
      description: "Create comprehensive fundraising plans with investor targeting, valuation estimates, and pitch optimization for Indian market.",
      features: ["Indian investor mapping", "Funding stage planning", "Valuation in INR", "Pitch deck optimization"]
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Go-to-Market Planning",
      description: "Develop launch strategies tailored for Indian market with pricing, marketing channels, and customer acquisition tactics.",
      features: ["Indian market entry", "Regional pricing strategies", "Marketing channel selection", "Customer acquisition funnels"]
    }
  ]

  const BUSINESS_INTELLIGENCE = [
    {
      icon: <Gavel className="w-6 h-6 text-amber-600" />,
      title: "Legal & Compliance",
      description: "Navigate Indian regulations, GDPR compliance, and legal requirements for your startup."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      title: "Risk Assessment",
      description: "Identify and mitigate technical, market, and regulatory risks specific to Indian business environment."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "Success Metrics & KPIs",
      description: "Define measurable success criteria and track progress with Indian startup benchmarks."
    },
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      title: "Market Validation",
      description: "Validate your ideas with real market data, user sentiment analysis, and demand forecasting."
    }
  ]

  const TECHNICAL_FEATURES = [
    {
      icon: <Component className="w-5 h-5" />,
      title: "Tech Stack Optimization",
      description: "Get personalized technology recommendations based on your project requirements and team skills."
    },
    {
      icon: <History className="w-5 h-5" />,
      title: "Project History & Tracking",
      description: "Access all your generated ideas, track iterations, and manage multiple project concepts."
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "Export & Collaboration",
      description: "Export plans as PDFs, share with team members, and collaborate on project development."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Real-time Updates",
      description: "Get live market insights, trend updates, and competitive intelligence as markets evolve."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md shadow-blue-500/20">
              <Image 
                src="/xdit_logo.jpeg" 
                alt="Xdit Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-slate-900">Xdit</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link 
              href="/features" 
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <a 
              href="https://www.linkedin.com/in/kirthi-sai/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center">
            <SignedIn>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View History"
              >
                <History className="w-5 h-5" />
              </button>
            </SignedIn>
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
            Powered by Xdit AI Research Engine
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Discover Your Next Big
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              SaaS Product Idea
            </span>
          </h1>

            <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto">
              Transform your concepts into innovative SaaS solutions with Xdit&apos;s advanced AI research engine. 
              Our platform analyzes real-time market data, identifies emerging opportunities, and generates 
              comprehensive project blueprints with detailed technical specifications and business insights.
            </p>
        </div>

        {/* Input Form */}
        <div className="mb-24 max-w-3xl mx-auto">
          <SignedIn>
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
                        <span>Researching...</span>
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
          </SignedIn>
          <SignedOut>
            <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to generate ideas</h3>
              <p className="text-slate-600 mb-6">Please sign in to use the idea generator and save your ideas.</p>
              <div className="flex justify-center space-x-4">
                <SignInButton mode="modal">
                  <button className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-5 py-3 bg-slate-200 text-slate-800 font-semibold rounded-xl hover:bg-slate-300 transition-all duration-300 flex items-center space-x-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>

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
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">Research Sources:</span>
                    <span>Each idea below includes links to the internet forums, articles, and sources used for research</span>
                  </div>
                </div>
              </div>
            )}

            {/* Project Ideas */}
            {projectIdeas.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
                    AI-Generated Project Ideas
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {projectIdeas.length} Ideas Generated
                    </span>
                  </div>
                </div>
                {projectIdeas.map((idea, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                              Idea #{index + 1}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900">
                              {idea.idea}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(idea.difficulty)}`}>
                            {idea.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {idea.description}
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                            <Search className="w-4 h-4 mr-1" />
                            Market Need
                          </h4>
                          <p className="text-sm text-slate-600">{idea.marketNeed}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Market Value
                          </h4>
                          <p className="text-sm text-slate-600">{idea.marketValue}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Estimated Time
                          </h4>
                          <p className="text-sm text-slate-600">{idea.estimatedTime}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          Suggested Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(idea.techStack || []).map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Research Sources */}
                      {idea.sources && idea.sources.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-blue-600" />
                            Research Sources
                          </h4>
                          <div className="space-y-2">
                            {idea.sources.slice(0, 5).map((source, sourceIndex) => (
                              <div key={sourceIndex} className="text-sm">
                                {source.title && (
                                  <div className="font-medium text-slate-800 mb-1">
                                    {source.title}
                                  </div>
                                )}
                                {source.url && (
                                  <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-xs"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {source.url.length > 50 ? source.url.substring(0, 50) + '...' : source.url}
                                  </a>
                                )}
                                {source.snippet && (
                                  <div className="text-slate-600 text-xs mt-1 line-clamp-2">
                                    {source.snippet}
                                  </div>
                                )}
                              </div>
                            ))}
                            {idea.sources.length > 5 && (
                              <div className="text-xs text-slate-500 pt-2 border-t border-blue-200">
                                +{idea.sources.length - 5} more sources
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end space-x-3">
                        <Link 
                          href={`/planning?historyId=${idea._id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Brief</span>
                        </Link>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-slate-600">Researching with Xdit AI Engine...</p>
                <p className="text-sm text-slate-500 mt-2">Xdit AI is performing comprehensive research and idea generation</p>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p>🔍 Researching market trends with Xdit intelligence</p>
                  <p>💡 Generating 5 innovative project ideas</p>
                  <p>📊 Analyzing market gaps and opportunities</p>
                  <p>🔗 Collecting research sources and validation data</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Features Section */}
        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-8 mb-20">
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

        {/* Core Features Section */}
        {!hasSearched && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Business Intelligence Platform</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to transform your ideas into successful businesses
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {CORE_FEATURES.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-slate-500">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Intelligence Section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Business Intelligence</h3>
                <p className="text-slate-600">Advanced analytics and insights to make informed business decisions</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {BUSINESS_INTELLIGENCE.map((feature, index) => (
                  <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Features Section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Technical Features</h3>
                <p className="text-slate-600">Powerful tools and integrations for seamless project management</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TECHNICAL_FEATURES.map((feature, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {feature.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Indian Market Focus Section */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Built for Indian Entrepreneurs</h3>
                  <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
                    Xdit understands the Indian market. Get funding strategies in INR, compliance with Indian regulations, 
                    and business plans tailored for the Indian startup ecosystem.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold mb-2">₹ INR</div>
                      <div className="text-white/80">Indian Currency Focus</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-2">🇮🇳</div>
                      <div className="text-white/80">Local Market Insights</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-2">📈</div>
                      <div className="text-white/80">Startup India Ready</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Build Your Next Big Idea?</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs using Xdit to turn their concepts into successful businesses. 
                  Start your journey today with our comprehensive AI-powered platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg">
                        <span>Start Building Now</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <button 
                      onClick={() => document.querySelector('input')?.focus()}
                      className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg"
                    >
                      <span>Start Building Now</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </SignedIn>
                  <Link 
                    href="/features"
                    className="inline-flex items-center px-8 py-4 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-lg"
                  >
                    <span>Explore All Features</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Sidebar */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectIdea={handleSelectHistoryIdea}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Xdit. All rights reserved.</p>
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