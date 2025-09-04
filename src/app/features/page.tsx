"use client";

import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import {
  Brain,
  History,
  FileText,
  Share2,
  Shield,
  Users2,
  Gavel,
  DollarSign,
  Rocket,
  AlertTriangle,
  BarChart3,
  Globe2,
  Component,
  Target,
  Clock,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
  BookOpen,
  UserPlus
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

// ... existing code ...

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
    icon: <Rocket className="w-8 h-8 text-white" />,
    title: "Go-to-Market Planning",
    description: "Develop launch strategies tailored for Indian market with pricing, marketing channels, and customer acquisition tactics.",
    features: ["Indian market entry", "Regional pricing strategies", "Marketing channel selection", "Customer acquisition funnels"]
  }
];

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
];

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
];

export default function FeaturesPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
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
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-blue-600 font-semibold">Features</span>
            <a href="https://www.linkedin.com/in/kirthi-sai/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <Sparkles className="w-5 h-5 mr-2" />
            Comprehensive Business Intelligence Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Everything You Need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Build Your Startup
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto">
            From AI-powered idea generation to comprehensive business planning, patent analysis, and fundraising strategies. 
            Xdit provides everything Indian entrepreneurs need to turn concepts into successful businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
              <span>Try Xdit Free</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
              <BookOpen className="w-5 h-5 mr-2" />
              View Demo
            </button>
          </div>
        </div>
        
        {/* Core Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools to transform your ideas into successful businesses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>

        {/* Business Intelligence Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Intelligence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced analytics and insights to make informed business decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BUSINESS_INTELLIGENCE.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Technical Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools and integrations for seamless project management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECHNICAL_FEATURES.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Indian Market Focus Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Built for Indian Entrepreneurs</h2>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Build Your Next Big Idea?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs using Xdit to turn their concepts into successful businesses. 
              Start your journey today with our comprehensive AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg">
                <span>Start Building Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-lg">
                <Eye className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Xdit. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}