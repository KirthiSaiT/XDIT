"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import {
  Brain,
  FileText,
  DollarSign,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UserPlus,
  TrendingUp,
  Database,
  Code,
  Layers,
  Search,
  MessageSquare,
  Award,
  Briefcase,
  PieChart,
  Activity,
  Settings,
  ExternalLink
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

// Feature Categories for Interactive Navigation
const FEATURE_CATEGORIES = [
  {
    id: 'ai-research',
    title: 'AI Research Engine',
    icon: <Brain className="w-6 h-6" />,
    description: 'Advanced AI-powered market research and analysis',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'business-planning',
    title: 'Business Intelligence',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Comprehensive business planning and strategy tools',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'technical-tools',
    title: 'Technical Tools',
    icon: <Code className="w-6 h-6" />,
    description: 'Development and technical implementation features',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    icon: <PieChart className="w-6 h-6" />,
    description: 'Data-driven insights and performance metrics',
    color: 'from-orange-500 to-red-500'
  }
];

// Detailed Feature Showcase
const FEATURE_SHOWCASE = {
  'ai-research': {
    title: 'AI Research Engine',
    subtitle: 'Powered by Advanced Machine Learning',
    features: [
      {
        icon: <Search className="w-8 h-8" />,
        title: 'Real-Time Market Analysis',
        description: 'Scan thousands of data sources in real-time to identify market opportunities and trends.',
        benefits: ['Live market data', 'Trend prediction', 'Opportunity scoring', 'Competitive analysis'],
        demo: 'Watch our AI analyze 500+ sources in 30 seconds'
      },
      {
        icon: <TrendingUp className="w-8 h-8" />,
        title: 'Predictive Market Intelligence',
        description: 'Forecast market trends and identify emerging opportunities before your competitors.',
        benefits: ['6-month trend forecasts', 'Emerging market detection', 'Risk assessment', 'Growth predictions'],
        demo: 'See future market predictions in action'
      },
      {
        icon: <Database className="w-8 h-8" />,
        title: 'Comprehensive Data Sources',
        description: 'Access data from news, social media, patents, financial reports, and industry publications.',
        benefits: ['100K+ data sources', 'Real-time updates', 'Quality scoring', 'Source verification'],
        demo: 'Explore our vast data network'
      }
    ]
  },
  'business-planning': {
    title: 'Business Intelligence Suite',
    subtitle: 'Transform Ideas into Business Plans',
    features: [
      {
        icon: <FileText className="w-8 h-8" />,
        title: 'Automated Business Plan Generation',
        description: 'Generate comprehensive business plans with financial projections and market analysis.',
        benefits: ['Executive summaries', 'Financial models', 'Market research', 'Risk analysis'],
        demo: 'Generate a full business plan in 5 minutes'
      },
      {
        icon: <DollarSign className="w-8 h-8" />,
        title: 'Financial Modeling & Projections',
        description: 'Create detailed financial models with revenue projections and funding requirements.',
        benefits: ['5-year projections', 'Scenario planning', 'Break-even analysis', 'Funding roadmaps'],
        demo: 'Build interactive financial models'
      },
      {
        icon: <Target className="w-8 h-8" />,
        title: 'Go-to-Market Strategy',
        description: 'Develop launch strategies tailored for your target market and customer segments.',
        benefits: ['Customer personas', 'Pricing strategies', 'Channel optimization', 'Launch timelines'],
        demo: 'Plan your product launch strategy'
      }
    ]
  },
  'technical-tools': {
    title: 'Technical Implementation',
    subtitle: 'From Concept to Code',
    features: [
      {
        icon: <Code className="w-8 h-8" />,
        title: 'Tech Stack Recommendations',
        description: 'Get personalized technology recommendations based on your project requirements.',
        benefits: ['Framework selection', 'Database recommendations', 'Architecture patterns', 'Scalability planning'],
        demo: 'Get your ideal tech stack in seconds'
      },
      {
        icon: <Layers className="w-8 h-8" />,
        title: 'Architecture Design',
        description: 'Generate system architecture diagrams and technical specifications.',
        benefits: ['System diagrams', 'API design', 'Database schemas', 'Security protocols'],
        demo: 'Visualize your system architecture'
      },
      {
        icon: <Settings className="w-8 h-8" />,
        title: 'Development Roadmap',
        description: 'Create detailed development timelines with milestones and resource allocation.',
        benefits: ['Sprint planning', 'Resource allocation', 'Timeline estimation', 'Risk mitigation'],
        demo: 'Build your development roadmap'
      }
    ]
  },
  'analytics': {
    title: 'Analytics & Performance',
    subtitle: 'Data-Driven Decision Making',
    features: [
      {
        icon: <Activity className="w-8 h-8" />,
        title: 'Real-Time Performance Tracking',
        description: 'Monitor your project performance with real-time analytics and insights.',
        benefits: ['Live dashboards', 'KPI tracking', 'Performance alerts', 'Trend analysis'],
        demo: 'View live performance dashboards'
      },
      {
        icon: <PieChart className="w-8 h-8" />,
        title: 'Market Position Analysis',
        description: 'Understand your competitive position and identify growth opportunities.',
        benefits: ['Competitor benchmarking', 'Market share analysis', 'Growth opportunities', 'Positioning insights'],
        demo: 'Analyze your market position'
      },
      {
        icon: <Award className="w-8 h-8" />,
        title: 'Success Metrics & KPIs',
        description: 'Define and track key performance indicators for your business success.',
        benefits: ['Custom KPIs', 'Success benchmarks', 'Progress tracking', 'Goal alignment'],
        demo: 'Set up your success metrics'
      }
    ]
  }
};

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('ai-research');
  const [activeFeature, setActiveFeature] = useState(0);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold mb-6">
            <Sparkles className="w-5 h-5 mr-2" />
            Complete Feature Showcase
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Every Tool You Need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Build & Scale Your Startup
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto">
            Explore Xdit&apos;s comprehensive suite of AI-powered tools designed specifically for Indian entrepreneurs. 
            From market research to business planning, technical implementation to performance analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg">
              <span>Try Xdit Free</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Interactive Feature Categories */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Features by Category</h2>
            <p className="text-lg text-slate-600">Click on any category to dive deep into its capabilities</p>
          </div>
          
          {/* Category Navigation */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {FEATURE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  activeCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-r ${category.color}`}>
                  <div className="text-white">{category.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.title}</h3>
                <p className="text-sm text-slate-600">{category.description}</p>
              </button>
            ))}
          </div>

          {/* Active Category Showcase */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <h3 className="text-3xl font-bold mb-2">{FEATURE_SHOWCASE[activeCategory as keyof typeof FEATURE_SHOWCASE].title}</h3>
              <p className="text-blue-100 text-lg">{FEATURE_SHOWCASE[activeCategory as keyof typeof FEATURE_SHOWCASE].subtitle}</p>
            </div>
            
            <div className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {FEATURE_SHOWCASE[activeCategory as keyof typeof FEATURE_SHOWCASE].features.map((feature: { icon: React.ReactElement; title: string; description: string; benefits: string[]; demo: string }, index: number) => (
                  <div key={index} className="group cursor-pointer" onClick={() => setActiveFeature(index)}>
                    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      activeFeature === index
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 group-hover:border-blue-300 group-hover:shadow-md'
                    }`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                      <p className="text-slate-600 mb-4">{feature.description}</p>
                      
                      {/* Benefits */}
                      <div className="space-y-2 mb-4">
                        {feature.benefits.map((benefit: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Demo CTA */}
                      <button className="flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        <span>{feature.demo}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about Xdit&apos;s features and capabilities
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">How accurate is Xdit&apos;s market research?</h3>
                <p className="text-slate-600">Xdit&apos;s AI research engine analyzes over 100,000 data sources in real-time, providing 95%+ accuracy in market trend identification and opportunity assessment.</p>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Can I export my business plans and research?</h3>
                <p className="text-slate-600">Yes! Professional and Enterprise plans include PDF export, Word document generation, and PowerPoint presentation creation for all your business plans and research reports.</p>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Is Xdit suitable for different industries?</h3>
                <p className="text-slate-600">Absolutely! Xdit&apos;s AI is trained on data from over 500 industries, making it effective for everything from healthcare and fintech to e-commerce and SaaS.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">How does the Indian market focus work?</h3>
                <p className="text-slate-600">Xdit includes specialized data sources for the Indian market, INR-based financial modeling, regulatory compliance guidance, and investor databases specific to India.</p>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What kind of support do you provide?</h3>
                <p className="text-slate-600">We offer community support for free users, priority email support for Professional users, and dedicated account managers for Enterprise customers.</p>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Can teams collaborate on projects?</h3>
                <p className="text-slate-600">Yes! Professional plans support up to 5 team members, while Enterprise plans offer unlimited team collaboration with role-based permissions and project sharing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Ideas?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join over 10,000 entrepreneurs who have built successful businesses with Xdit&apos;s AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-lg">
                      <span>Start Your Free Trial</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-lg">
                    <span>Start Building Now</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </SignedIn>
                <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Talk to Sales
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">10,000+</div>
                  <div className="text-blue-200">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">₹50Cr+</div>
                  <div className="text-blue-200">Funding Raised</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-blue-200">Success Rate</div>
                </div>
              </div>
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