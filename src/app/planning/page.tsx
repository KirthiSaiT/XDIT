"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
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
} from "lucide-react";

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface PlanningError {
  message: string;
  code?: string;
  details?: unknown;
}

const SECTION_ICONS: { [key: string]: React.ReactNode } = {
  "Technical Architecture": <Component className="w-5 h-5" />,
  "Team Roles & Responsibilities": <Users className="w-5 h-5" />,
  "Development Timeline & Milestones": <GanttChartSquare className="w-5 h-5" />,
  "Go-to-Market (GTM) Strategy": <Target className="w-5 h-5" />,
  "Growth & Scaling Strategy": <TrendingUp className="w-5 h-5" />,
  "default": <BrainCircuit className="w-5 h-5" />
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
  const sectionRegex = /(?:^|\n)##\s(.+)/g;
  const parts = planText.split(sectionRegex).filter(part => part.trim() !== '');

  if (parts.length <= 1) {
    return [{ title: "Project Plan", content: planText, icon: SECTION_ICONS["default"] }];
  }

  const structuredSections: Section[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const title = parts[i].trim();
    const content = parts[i + 1] ? parts[i + 1].trim() : '';
    const icon = Object.entries(SECTION_ICONS).find(([key]) => title.includes(key))?.[1] || SECTION_ICONS["default"];
    structuredSections.push({ title, content, icon });
  }
  return structuredSections;
};

// --- UI Components for different states ---

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
    <Card className="w-full max-w-md mx-4">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl">Generating Your Blueprint</CardTitle>
          <CardDescription>
            The AI is crafting a detailed plan. This may take a moment.
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <strong>Generation Failed</strong>
            <br />
            {error}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
        <Lightbulb className="w-12 h-12 text-primary" />
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl">No Project Selected</CardTitle>
          <CardDescription>
            Please go back and select a project to generate a development plan.
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  </div>
);

// --- Page Content Component ---

function PlanningPageContent() {
  const historyId = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return new URLSearchParams(window.location.search).get("historyId");
  }, []);

  const [plan, setPlan] = useState<string | null>(null);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const sections = useMemo(() => parsePlanIntoSections(plan || ''), [plan]);

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
      setLoading(false);
      return;
    }

    const fetchPlanAndIdea = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ideaRes, planRes] = await Promise.all([
          fetch(`/api/ideas/${historyId}`),
          fetch(`/api/planning?historyId=${encodeURIComponent(historyId)}`)
        ]);

        if (!ideaRes.ok || !planRes.ok) {
          const errorData = !ideaRes.ok ? await ideaRes.json() : await planRes.json();
          throw new Error(errorData.error || "Failed to fetch project data.");
        }

        const ideaData = await ideaRes.json();
        const planData = await planRes.json();

        if (ideaData.success) setIdea(ideaData.idea);
        setPlan(planData.plan);

      } catch (e: unknown) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndIdea();
  }, [historyId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!historyId || !idea || !plan) return <EmptyState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Project Header Card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                      {idea.idea}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed max-w-4xl">
                      {idea.description}
                    </CardDescription>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary/60 mt-1" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-background/60 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                      </div>
                      <Badge variant={getDifficultyVariant(idea.difficulty)} className="font-semibold">
                        {idea.difficulty}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/60 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                      </div>
                      <p className="font-semibold text-foreground">{idea.estimatedTime}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/60 backdrop-blur md:col-span-2">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Component className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">Tech Stack</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.techStack.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
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
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-3">
              <Card className="sticky top-6 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Quick Navigation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-1">
                      {sections.map((section, index) => (
                        <Button
                          key={section.title}
                          variant={activeSection === section.title ? "secondary" : "ghost"}
                          className="w-full justify-start h-auto p-3 text-left"
                          asChild
                        >
                          <a href={`#${section.title.toLowerCase().replace(/\s/g, '-')}`}>
                            <div className="flex items-center space-x-3">
                              <div className={`${
                                activeSection === section.title 
                                  ? 'text-primary' 
                                  : 'text-muted-foreground'
                              }`}>
                                {section.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {section.title}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-50" />
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
            <div className="lg:col-span-9">
              <div className="space-y-6">
                {sections.map(({ title, content }, index) => (
                  <Card
                    key={title}
                    id={title.toLowerCase().replace(/\s/g, '-')}
                    ref={(el) => { sectionRefs.current[index] = el; }}
                    className="scroll-mt-6 border-0 shadow-lg overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-r from-muted/50 to-background">
                      <CardTitle className="flex items-center space-x-3 text-xl">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {Object.entries(SECTION_ICONS).find(([key]) => 
                            title.includes(key)
                          )?.[1] || SECTION_ICONS["default"]}
                        </div>
                        <span>{title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-auto max-h-[600px]">
                        <div className="p-6">
                          <article className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </article>
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
  );
}

export default function PlanningPage() {
  return (
    <React.Suspense fallback={<LoadingState />}>
      <PlanningPageContent />
    </React.Suspense>
  );
}