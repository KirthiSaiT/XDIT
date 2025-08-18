// app/planning/page.tsx

"use client";

import React, { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
  Clock,
  Zap,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

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

const SECTION_ICONS: { [key: string]: React.ReactNode } = {
  "Technical Architecture": <Component className="w-5 h-5" />,
  "Team Roles & Responsibilities": <Users className="w-5 h-5" />,
  "Development Timeline & Milestones": <GanttChartSquare className="w-5 h-5" />,
  "Go-to-Market (GTM) Strategy": <Target className="w-5 h-5" />,
  "Growth & Scaling Strategy": <TrendingUp className="w-5 h-5" />,
  "default": <BrainCircuit className="w-5 h-5" />
};

// --- Helper Functions ---

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  }
};

const parsePlanIntoSections = (plan: string): Section[] => {
  // Splits the plan by Markdown headings (##)
  const sectionRegex = /(?:^|\n)##\s(.+)/g;
  const sections = plan.split(sectionRegex).filter(Boolean);

  if (sections.length <= 1) {
    return [{ title: "Project Plan", content: plan, icon: SECTION_ICONS["default"] }];
  }
  
  const structuredSections: Section[] = [];
  for (let i = 0; i < sections.length; i += 2) {
    const title = sections[i].trim();
    const content = sections[i + 1] ? sections[i+1].trim() : '';
    const mainTitle = title.replace(/\d+\.\s*/, ''); // Remove leading numbers like "1. "
    const icon = Object.entries(SECTION_ICONS).find(([key]) => mainTitle.includes(key))?.[1] || SECTION_ICONS["default"];
    structuredSections.push({ title: mainTitle, content, icon });
  }
  return structuredSections;
};

// --- UI Components ---

const LoadingState = () => (
  <div className="text-center py-20">
    <div className="inline-block relative">
      <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
      <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2" />
    </div>
    <h3 className="text-3xl font-bold text-slate-800 mt-6">Generating Your Blueprint...</h3>
    <p className="text-slate-500 text-lg mt-2">The AI is crafting a detailed plan. This may take a moment.</p>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
    <ServerCrash className="w-12 h-12 text-red-500 mx-auto" />
    <h4 className="font-bold text-2xl text-red-800 mt-4">Generation Failed</h4>
    <p className="text-red-600 mt-2">{error}</p>
  </div>
);

const EmptyState = () => (
    <div className="text-center max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-10">
      <Lightbulb className="w-12 h-12 text-indigo-500 mx-auto" />
      <h3 className="text-2xl font-bold text-slate-800 mt-4">No Project Selected</h3>
      <p className="text-slate-500 mt-2">Please select a project from your history to generate a new plan.</p>
    </div>
);

const PlanSidebar = ({ sections, activeSection }: { sections: Section[], activeSection: string }) => (
  <nav className="sticky top-24 space-y-2">
    <h3 className="px-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">Plan Sections</h3>
    {sections.map(({ title, icon }) => {
        const isActive = activeSection === title;
        return (
          <a
            key={title}
            href={`#${title.toLowerCase().replace(/\s/g, '-')}`}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
            <span>{title}</span>
          </a>
        );
    })}
  </nav>
);

const PlanDisplay = ({ idea, plan }: { idea: Idea, plan: string }) => {
  const sections = useMemo(() => parsePlanIntoSections(plan), [plan]);
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.title || "");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const title = sections.find(s => id === s.title.toLowerCase().replace(/\s/g, '-'))?.title;
            if (title) setActiveSection(title);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [sections]);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-12">
      {/* --- Left Sidebar --- */}
      <aside className="w-full lg:w-1/4 mb-10 lg:mb-0">
        <PlanSidebar sections={sections} activeSection={activeSection} />
      </aside>

      {/* --- Right Content --- */}
      <main className="flex-1 space-y-16">
        {/* Project Overview Header */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{idea.idea}</h1>
          <p className="text-xl text-slate-600">{idea.description}</p>
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-500 mb-1">Difficulty</p>
                  <p className={`text-sm font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full ${getDifficultyColor(idea.difficulty)}`}>{idea.difficulty}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-500 mb-1">Timeline</p>
                  <p className="font-semibold text-slate-800">{idea.estimatedTime}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 col-span-2">
                  <p className="text-sm font-medium text-slate-500 mb-1">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                      {idea.techStack.map(tech => <span key={tech} className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded">{tech}</span>)}
                  </div>
              </div>
          </div>
        </header>

        {/* Plan Sections */}
        <div className="space-y-12">
          {sections.map(({ title, content }, index) => (
            <section
              key={title}
              id={title.toLowerCase().replace(/\s/g, '-')}
              ref={el => sectionRefs.current[index] = el}
              className="scroll-mt-24"
            >
              <div className="flex items-center space-x-3 mb-4">
                <ChevronRight className="w-6 h-6 text-indigo-500" />
                <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
              </div>
              <article className="prose prose-lg prose-indigo max-w-none text-slate-700 prose-headings:text-slate-800 prose-a:text-indigo-600 prose-strong:text-slate-800">
                <ReactMarkdown>{content}</ReactMarkdown>
              </article>
            </section>
          ))}
        </div>

        {/* Success Footer */}
        <footer className="text-center pt-8">
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 inline-flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-600"/>
                <p className="font-semibold text-green-800">Plan Generated Successfully!</p>
            </div>
        </footer>
      </main>
    </div>
  );
};

// --- Page Component ---

function PlanningPageContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams?.get("historyId");

  const [plan, setPlan] = useState<string | null>(null);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId) {
        setLoading(false);
        return;
    };

    const fetchPlanAndIdea = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both in parallel for speed
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

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndIdea();
  }, [historyId]);
  
  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (plan && idea) return <PlanDisplay idea={idea} plan={plan} />;
    if (!historyId) return <EmptyState />;
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {renderContent()}
      </div>
    </div>
  );
}

export default function PlanningPage() {
  return (
    <Suspense>
      <PlanningPageContent />
    </Suspense>
  );
}