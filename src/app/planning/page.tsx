"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Loader2, 
  ServerCrash, 
  Lightbulb, 
  Component, 
  Users, 
  GanttChartSquare, 
  Target, 
  TrendingUp, 
  BrainCircuit,
  Clock,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign,
  Globe
} from "lucide-react";

const sectionIcons: { [key: string]: React.ReactNode } = {
    "Technical Architecture": <Component className="w-6 h-6" />,
    "Team Roles & Responsibilities": <Users className="w-6 h-6" />,
    "Development Timeline & Milestones": <GanttChartSquare className="w-6 h-6" />,
    "Go-to-Market (GTM) Strategy": <Target className="w-6 h-6" />,
    "Growth & Scaling Strategy": <TrendingUp className="w-6 h-6" />,
    "default": <BrainCircuit className="w-6 h-6" />
};

const sectionColors: { [key: string]: string } = {
    "Technical Architecture": "from-blue-500 to-blue-600",
    "Team Roles & Responsibilities": "from-green-500 to-green-600",
    "Development Timeline & Milestones": "from-purple-500 to-purple-600",
    "Go-to-Market (GTM) Strategy": "from-red-500 to-red-600",
    "Growth & Scaling Strategy": "from-yellow-500 to-yellow-600",
    "default": "from-slate-500 to-slate-600"
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'hard': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

const PlanDisplay = ({ plan, idea }: { plan: string, idea: any }) => {
    const sections = plan.split('**').filter(p => p.trim() !== '').map(s => s.replace(/:/g, ''));
  
    return (
      <div className="space-y-8">
        {/* Hero Section - Project Overview */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{idea.idea}</h1>
                  <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">{idea.description}</p>
                </div>
              </div>
            </div>
            
            {/* Project Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Difficulty</span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(idea.difficulty)}`}>
                  {idea.difficulty}
                </span>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Timeline</span>
                </div>
                <p className="text-white font-semibold">{idea.estimatedTime}</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-slate-300">Market Need</span>
                </div>
                <p className="text-white font-semibold">High Demand</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <Component className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium text-slate-300">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {idea.techStack?.slice(0, 2).map((tech: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-white/10 text-xs text-white rounded-lg">
                      {tech}
                    </span>
                  ))}
                  {idea.techStack?.length > 2 && (
                    <span className="px-2 py-1 bg-white/10 text-xs text-white rounded-lg">
                      +{idea.techStack.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Market Need Section */}
            {idea.marketNeed && (
              <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-400" />
                  Market Opportunity
                </h3>
                <p className="text-slate-300 leading-relaxed">{idea.marketNeed}</p>
              </div>
            )}
          </div>
        </div>

        {/* Plan Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            if (index % 2 === 0) {
              const title = section.trim();
              const content = sections[index + 1] || '';
              const icon = sectionIcons[title] || sectionIcons["default"];
              const gradientColor = sectionColors[title] || sectionColors["default"];
              
              return (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    {/* Section Header */}
                    <div className={`bg-gradient-to-r ${gradientColor} p-8`}>
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                          <div className="text-white">
                            {icon}
                          </div>
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-white">{title}</h2>
                          <div className="flex items-center mt-2 text-white/80">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Strategic Implementation Guide</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Section Content */}
                    <div className="p-8">
                      <div className="space-y-6">
                        {content.split(/\s*(?=\*)/).map((item, i) => {
                          const trimmedItem = item.replace('*', '').trim();
                          if (trimmedItem) {
                            return (
                              <div key={i} className="group/item flex items-start space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
                                <div className="flex-shrink-0 mt-1">
                                  <div className={`w-3 h-3 bg-gradient-to-r ${gradientColor} rounded-full shadow-lg group-hover/item:scale-110 transition-transform duration-300`}></div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-slate-700 text-base leading-relaxed font-medium">
                                    {trimmedItem}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Success Footer */}
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border border-green-200 p-8">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">Plan Generated Successfully!</h3>
            <p className="text-green-700 max-w-md mx-auto">
              Your comprehensive project plan is ready. Follow these strategic steps to bring your idea to life.
            </p>
          </div>
        </div>
      </div>
    );
};

function PlanningPageContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams?.get("historyId");
  const [plan, setPlan] = useState<string | null>(null);
  const [idea, setIdea] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId) return;

    async function fetchPlanAndIdea() {
      setLoading(true);
      setError(null);
      setPlan(null);
      setIdea(null);
      try {
        const ideaRes = await fetch(`/api/ideas/${historyId}`);
        if(ideaRes.ok) {
            const ideaData = await ideaRes.json();
            if(ideaData.success) {
                setIdea(ideaData.idea);
            }
        }

        const res = await fetch(`/api/planning?historyId=${encodeURIComponent(historyId)}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error: ${res.status}`);
        }
        const json = await res.json();
        setPlan(json.plan);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlanAndIdea();
  }, [historyId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <BrainCircuit className="w-4 h-4" />
            <span>AI-Powered Planning</span>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-6">
            Project Blueprint
          </h1>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive AI-generated roadmap to build, launch, and scale your next big idea
          </p>
        </div>

        {!historyId && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12">
              <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 border border-blue-200">
                <Lightbulb className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">No Project Selected</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Head back to your project history and select a project idea to generate its comprehensive development plan.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto border border-blue-200">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Crafting Your Blueprint</h3>
              <p className="text-slate-600 text-lg mb-4">
                Our AI is analyzing your project and creating a detailed strategic plan...
              </p>
              <p className="text-sm text-slate-500">
                This comprehensive analysis may take a few moments as we ensure every detail is perfect.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 shadow-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 rounded-full p-3">
                  <ServerCrash className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-2xl text-red-900 mb-2">Plan Generation Failed</h4>
                  <p className="text-red-700 text-lg leading-relaxed">{error}</p>
                  <p className="text-red-600 text-sm mt-2">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {plan && idea && (
          <PlanDisplay plan={plan} idea={idea} />
        )}
      </div>
    </div>
  );
}

export default function PlanningPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            </div>
        </div>
    }>
      <PlanningPageContent />
    </Suspense>
  );
}
