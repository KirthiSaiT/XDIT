"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from 'next/link';
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
  Sparkles,
  Clock,
  Zap,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Share2,
  UserPlus,
  History,
  FileDown
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// --- Types and Constants ---

interface Idea {
  idea: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  marketNeed: string;
  techStack: string[];
}

interface Section {
  title: string;
  content: string;
  icon: React.ReactNode;
}

// The 'PlanningError' interface was removed as it was unused.

const SECTION_ICONS: { [key: string]: React.ReactNode } = {
  "Problem & Solution": <Lightbulb className="w-5 h-5" />,
  "Technical Requirements": <Component className="w-5 h-5" />,
  "Frontend": <Component className="w-5 h-5" />,
  "Backend": <Users className="w-5 h-5" />,
  "Database": <GanttChartSquare className="w-5 h-5" />,
  "Additional Tools": <Zap className="w-5 h-5" />,
  "AI/ML Components": <BrainCircuit className="w-5 h-5" />,
  "Development Plan": <GanttChartSquare className="w-5 h-5" />,
  "Market & Revenue": <TrendingUp className="w-5 h-5" />,
  "Business Viability": <Target className="w-5 h-5" />,
  "default": <BrainCircuit className="w-5 h-5" />
};

// Helper function to get icons for subsections
const getSubsectionIcon = (subsectionTitle: string): React.ReactNode => {
  const title = subsectionTitle.toLowerCase();
  
  if (title.includes('frontend') || title.includes('client') || title.includes('ui') || title.includes('react') || title.includes('vue') || title.includes('angular')) {
    return <Component className="w-4 h-4 text-blue-600" />;
  }
  if (title.includes('backend') || title.includes('server') || title.includes('api') || title.includes('node') || title.includes('express') || title.includes('django')) {
    return <Users className="w-4 h-4 text-green-600" />;
  }
  if (title.includes('database') || title.includes('db') || title.includes('storage') || title.includes('mongo') || title.includes('sql') || title.includes('postgres')) {
    return <GanttChartSquare className="w-4 h-4 text-purple-600" />;
  }
  if (title.includes('additional') || title.includes('tools') || title.includes('api') || title.includes('service') || title.includes('integration')) {
    return <Zap className="w-4 h-4 text-orange-600" />;
  }
  if (title.includes('ai') || title.includes('ml') || title.includes('machine learning') || title.includes('artificial intelligence') || title.includes('model')) {
    return <BrainCircuit className="w-4 h-4 text-indigo-600" />;
  }
  if (title.includes('mvp') || title.includes('feature') || title.includes('development') || title.includes('phase') || title.includes('milestone')) {
    return <Target className="w-4 h-4 text-teal-600" />;
  }
  if (title.includes('market') || title.includes('revenue') || title.includes('monetization') || title.includes('pricing') || title.includes('business')) {
    return <TrendingUp className="w-4 h-4 text-emerald-600" />;
  }
  
  return <Sparkles className="w-4 h-4 text-slate-600" />;
};

// --- Helper Functions ---

const getDifficultyVariant = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'default';
    case 'medium': return 'secondary';
    case 'hard': return 'destructive';
    default: return 'outline';
  }
};

const parsePlanIntoSections = (planText: string): Section[] => {
  if (!planText) return [];
  
  // Clean up the plan text first
  const cleanedText = planText
    .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove thinking tags
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/^\s*[-*+]\s+/gm, '') // Remove bullet points
    .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
    .trim();
  
  const sectionRegex = /(?:^|\n)##\s(.+)/g;
  const parts = cleanedText.split(sectionRegex).filter(part => part.trim() !== '');

  if (parts.length <= 1) {
    return [{ title: "Project Plan", content: cleanedText, icon: SECTION_ICONS["default"] }];
  }

  const structuredSections: Section[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const title = parts[i].trim();
    let content = parts[i + 1] ? parts[i + 1].trim() : '';
    
    // Further clean the content
    content = content
      .replace(/^\s*[-*+]\s+/gm, '') // Remove any remaining bullet points
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove any remaining bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove any remaining italic markdown
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');
    
    // Special handling for Technical Requirements section to ensure proper subsection formatting
    if (title.toLowerCase().includes('technical') && title.toLowerCase().includes('requirements')) {
      // Ensure common tech stack categories are properly formatted as subsections if not already
      const techCategories = ['Frontend', 'Backend', 'Database', 'Additional Tools', 'AI/ML Components'];
      
      techCategories.forEach(category => {
        const categoryRegex = new RegExp(`(?:^|\n)(${category}[^\n]*?)(?=\n|$)`, 'i');
        if (categoryRegex.test(content) && !content.includes(`### ${category}`)) {
          content = content.replace(categoryRegex, `\n### ${category}\n`);
        }
      });
    }
    
    const icon = Object.entries(SECTION_ICONS).find(([key]) => title.includes(key))?.[1] || SECTION_ICONS["default"];
    structuredSections.push({ title, content, icon });
  }
  return structuredSections;
};

// Helper function to parse subsections within content
const parseSubsections = (content: string) => {
  const subsectionRegex = /###\s(.+)/g;
  const parts = content.split(subsectionRegex);
  
  if (parts.length <= 1) {
    return [{ title: '', content: content }];
  }
  
  const subsections = [];
  // First part before any subsection
  if (parts[0].trim()) {
    subsections.push({ title: '', content: parts[0].trim() });
  }
  
  // Process subsections
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i]?.trim() || '';
    let content = parts[i + 1]?.trim() || '';
    
    // Further clean the content - remove any remaining markdown
    content = content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/^\s*[-*+]\s+/gm, '') // Remove bullet points
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Normalize multiple line breaks
      .trim();
    
    subsections.push({ title, content });
  }
  
  return subsections;
};

// --- UI Components for different states ---

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Card className="w-full max-w-lg mx-4 border-0 shadow-2xl">
      <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
        </div>
        <div className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Generating Your Blueprint
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 max-w-md">
            Our AI is crafting a comprehensive project plan using advanced market research. This may take 1-2 minutes.
          </CardDescription>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-500">
            <div className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Analyzing requirements</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Building architecture</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Market research</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span>Revenue analysis</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardContent className="p-8">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <ServerCrash className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDescription className="text-red-800">
                <div className="font-semibold mb-1">Generation Failed</div>
                <div className="text-sm">{error}</div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
        <div className="mt-6 flex flex-col space-y-3">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full border-red-200 text-red-700 hover:bg-red-50"
          >
            <Loader2 className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// --- Navigation Component ---
const PlanningNavbar = ({ onExportPDF }: { onExportPDF?: () => void }) => {
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">xxit</span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center space-x-2 text-slate-600">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Project Blueprint</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/features" 
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
          >
            Features
          </Link>
          <a 
            href="https://www.linkedin.com/in/kirthi-sai/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <SignedIn>
            {onExportPDF && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onExportPDF}
                className="hidden sm:flex bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            )}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

// --- Page Content Component ---

function PlanningPageContent() {
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Get historyId from URL parameters
  useEffect(() => {
    const updateHistoryId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('historyId');
      console.log('URL historyId detected:', id);
      setHistoryId(id);
    };
    
    // Initial check
    updateHistoryId();
    
    // Listen for navigation changes
    window.addEventListener('popstate', updateHistoryId);
    
    // If no historyId initially, keep checking for navigation updates
    const urlParams = new URLSearchParams(window.location.search);
    const initialId = urlParams.get('historyId');
    if (!initialId) {
      const checkForHistoryId = () => {
        const updatedParams = new URLSearchParams(window.location.search);
        const updatedId = updatedParams.get('historyId');
        if (updatedId) {
          console.log('Updated historyId detected:', updatedId);
          setHistoryId(updatedId);
        }
      };
      
      // Check again after a short delay in case navigation is still in progress
      const timeout = setTimeout(checkForHistoryId, 100);
      return () => {
        clearTimeout(timeout);
        window.removeEventListener('popstate', updateHistoryId);
      };
    }
    
    return () => {
      window.removeEventListener('popstate', updateHistoryId);
    };
  }, []);

  const sections = useMemo(() => parsePlanIntoSections(plan || ''), [plan]);

  // PDF Export functionality
  const exportToPDF = async () => {
    if (!idea || !plan) return;
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${idea.idea} - Project Blueprint</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
            .project-title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
            .project-description { font-size: 16px; color: #64748b; max-width: 800px; margin: 0 auto; }
            .metadata { display: flex; justify-content: space-around; margin: 20px 0; }
            .metadata-item { text-align: center; }
            .metadata-label { font-weight: bold; color: #475569; }
            .metadata-value { color: #1e293b; }
            .section { margin: 30px 0; page-break-inside: avoid; }
            .section-title { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px; }
            .subsection { margin: 20px 0; }
            .subsection-title { font-size: 16px; font-weight: bold; color: #475569; margin-bottom: 10px; }
            .content { font-size: 14px; line-height: 1.6; margin-bottom: 15px; }
            .tech-stack { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
            .tech-item { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            @media print { body { margin: 20px; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="project-title">${idea.idea}</div>
            <div class="project-description">${idea.description}</div>
            <div class="metadata">
              <div class="metadata-item">
                <div class="metadata-label">Difficulty</div>
                <div class="metadata-value">${idea.difficulty}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Timeline</div>
                <div class="metadata-value">${idea.estimatedTime}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Tech Stack</div>
                <div class="tech-stack">
                  ${idea.techStack.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
          
          ${sections.map(section => {
            const subsections = parseSubsections(section.content);
            return `
              <div class="section">
                <div class="section-title">${section.title}</div>
                ${subsections.map(subsection => {
                  if (subsection.title) {
                    return `
                      <div class="subsection">
                        <div class="subsection-title">${subsection.title}</div>
                        <div class="content">${subsection.content.replace(/\n/g, '<br>')}</div>
                      </div>
                    `;
                  } else {
                    return `<div class="content">${subsection.content.replace(/\n/g, '<br>')}</div>`;
                  }
                }).join('')}
              </div>
            `;
          }).join('')}
          
          <div style="margin-top: 40px; text-align: center; color: #64748b; font-size: 12px;">
            Generated by xxit - SaaS Idea Generator | ${new Date().toLocaleDateString()}
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  useEffect(() => {
    if (sections.length === 0) return;

    if (!activeSection) {
      setActiveSection(sections[0].title);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const section = sections.find(
              (s) => s.title.toLowerCase().replace(/\s/g, '-') === sectionId
            );
            if (section) {
              setActiveSection(section.title);
            }
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px", threshold: 0 }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [sections, activeSection]);

  const handleError = (error: unknown) => {
    let message = 'An unknown error occurred.';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      message = String((error as { message: unknown }).message);
    }
    setError(message);
    console.error("Planning Page Error:", error);
  };

  useEffect(() => {
    if (!historyId) {
      // Keep loading until we get a historyId
      return;
    }

    const fetchPlanAndIdea = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching plan and idea for historyId:', historyId);
      
      try {
        // First fetch the idea details
        console.log('Fetching idea details...');
        const ideaRes = await fetch(`/api/ideas/${historyId}`);
        if (!ideaRes.ok) {
          const errorData = await ideaRes.json();
          throw new Error(errorData.error || "Failed to fetch project data.");
        }
        
        const ideaData = await ideaRes.json();
        console.log('Idea data received:', ideaData);
        if (ideaData.success) {
          setIdea(ideaData.idea);
        }
        
        // Then check if plan exists or needs to be generated
        console.log('Fetching/generating plan...');
        const planRes = await fetch(`/api/planning?historyId=${encodeURIComponent(historyId)}`);
        if (!planRes.ok) {
          const errorData = await planRes.json();
          throw new Error(errorData.error || "Failed to generate project plan.");
        }
        
        const planData = await planRes.json();
        console.log('Plan data received, length:', planData.plan?.length || 0);
        setPlan(planData.plan);

      } catch (e: unknown) {
        console.error('Error in fetchPlanAndIdea:', e);
        handleError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndIdea();
  }, [historyId]);

  if (loading) return (
    <>
      <PlanningNavbar />
      <LoadingState />
    </>
  );
  if (error) return (
    <>
      <PlanningNavbar />
      <ErrorState error={error} />
    </>
  );
  if (!historyId || !idea || !plan) return (
    <>
      <PlanningNavbar />
      <LoadingState />
    </>
  );

  return (
    <>
      <PlanningNavbar onExportPDF={exportToPDF} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            {/* Back Navigation */}
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back to Ideas</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="shadow-sm">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </div>
            </div>

            {/* Project Header Card */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50 backdrop-blur">
              <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                          AI Generated Blueprint
                        </Badge>
                      </div>
                      <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
                        {idea.idea}
                      </CardTitle>
                      <CardDescription className="text-lg leading-relaxed max-w-4xl text-slate-600">
                        {idea.description}
                      </CardDescription>
                    </div>
                    <div className="hidden lg:block">
                      <div className="p-4 bg-white/60 rounded-2xl shadow-lg backdrop-blur">
                        <BookOpen className="w-12 h-12 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <Zap className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">Difficulty</p>
                        </div>
                        <Badge variant={getDifficultyVariant(idea.difficulty)} className="text-sm font-bold px-3 py-1">
                          {idea.difficulty}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">Timeline</p>
                        </div>
                        <p className="font-bold text-slate-800 text-lg">{idea.estimatedTime}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 group sm:col-span-2">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <Component className="w-5 h-5 text-purple-600" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">Tech Stack</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {idea.techStack.map((tech, index) => (
                            <Badge key={tech} variant="outline" className="text-xs font-medium bg-white/60 border-slate-200 hover:bg-slate-50 transition-colors">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Main Content Layout */}
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Navigation Sidebar */}
              <div className="lg:col-span-4 xl:col-span-3">
                <Card className="sticky top-24 border-0 shadow-xl bg-white/80 backdrop-blur">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Quick Navigation</span>
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Jump to any section of your project blueprint
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-2">
                        {sections.map((section, index) => (
                          <Button
                            key={section.title}
                            variant={activeSection === section.title ? "default" : "ghost"}
                            className={`w-full justify-start h-auto p-4 text-left transition-all duration-200 group ${
                              activeSection === section.title 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                                : 'hover:bg-slate-50 hover:shadow-md'
                            }`}
                            asChild
                          >
                            <a href={`#${section.title.toLowerCase().replace(/\s/g, '-')}`}>
                              <div className="flex items-center space-x-3 w-full">
                                <div className={`p-2 rounded-lg transition-colors ${
                                  activeSection === section.title 
                                    ? 'bg-white/20' 
                                    : 'bg-slate-100 group-hover:bg-slate-200'
                                }`}>
                                  <div className={activeSection === section.title ? 'text-white' : 'text-slate-600'}>
                                    {section.icon}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    activeSection === section.title ? 'text-white' : 'text-slate-700'
                                  }`}>
                                    {section.title}
                                  </p>
                                  <p className={`text-xs truncate mt-1 ${
                                    activeSection === section.title ? 'text-blue-100' : 'text-slate-500'
                                  }`}>
                                    Section {index + 1}
                                  </p>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                                  activeSection === section.title ? 'text-white' : 'text-slate-400'
                                }`} />
                              </div>
                            </a>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="space-y-8">
                  {sections.map(({ title, content }, sectionIndex) => (
                    <Card
                      key={title}
                      id={title.toLowerCase().replace(/\s/g, '-')}
                      ref={(el) => { sectionRefs.current[sectionIndex] = el; }}
                      className="scroll-mt-24 border-0 shadow-xl overflow-hidden bg-white/80 backdrop-blur hover:shadow-2xl transition-all duration-300 group"
                    >
                      <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center space-x-4 text-2xl">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <div className="text-white">
                              {Object.entries(SECTION_ICONS).find(([key]) => 
                                title.includes(key)
                              )?.[1] || SECTION_ICONS["default"]}
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-bold">
                              {title}
                            </span>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                Section {sectionIndex + 1}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                                AI Generated
                              </Badge>
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-auto max-h-[700px]">
                          <div className="p-8">
                            <div className="prose prose-base max-w-none text-slate-700 leading-relaxed">
                              {(() => {
                                const subsections = parseSubsections(content);
                                
                                return subsections.map((subsection, subIndex) => {
                                  if (subsection.title) {
                                    // This is a subsection with a title
                                    return (
                                      <div key={subIndex} className="mb-8">
                                        <div className="flex items-center space-x-3 mb-4">
                                          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                                            {getSubsectionIcon(subsection.title)}
                                          </div>
                                          <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 flex-1">
                                            {subsection.title}
                                          </h3>
                                        </div>
                                        <div className="ml-6 pl-4 border-l-2 border-blue-100">
                                          {subsection.content.split('\n\n').map((paragraph, pIndex) => (
                                            paragraph.trim() && (
                                              <p key={pIndex} className="text-base text-slate-700 leading-relaxed mb-4">
                                                {paragraph.trim()}
                                              </p>
                                            )
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    // This is general content without a subsection title
                                    return (
                                      <div key={subIndex} className="mb-6">
                                        {subsection.content.split('\n\n').map((paragraph, pIndex) => (
                                          paragraph.trim() && (
                                            <p key={pIndex} className="text-base text-slate-700 leading-relaxed mb-4">
                                              {paragraph.trim()}
                                            </p>
                                          )
                                        ))}
                                      </div>
                                    );
                                  }
                                });
                              })()
                              }
                            </div>
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PlanningPage() {
  return (
    <React.Suspense fallback={
      <>
        <PlanningNavbar />
        <LoadingState />
      </>
    }>
      <PlanningPageContent />
    </React.Suspense>
  );
}