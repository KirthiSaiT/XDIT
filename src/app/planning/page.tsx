"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ServerCrash, Lightbulb } from "lucide-react";

function PlanningPageContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams?.get("historyId");
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId) return;

    async function fetchPlan() {
      setLoading(true);
      setError(null);
      setPlan(null);
      try {
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

    fetchPlan();
  }, [historyId]);

  const PlanDisplay = ({ plan }: { plan: string }) => {
    const sections = plan.split('**').filter(p => p.trim() !== '').map(s => s.replace(/:/g, ''));
  
    return (
      <div className="space-y-8">
        {sections.map((section, index) => {
          if (index % 2 === 0) {
            const title = section.trim();
            const content = sections[index + 1] || '';
            return (
              <div key={index} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
                <div className="prose prose-slate max-w-none">
                  {content.split('* ').map((item, i) => {
                    if (i === 0) return <p key={i} className="text-slate-600">{item.trim()}</p>;
                    if (item.trim()) {
                      return (
                        <div key={i} className="flex items-start space-x-3 my-2">
                          <div className="flex-shrink-0 h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-slate-600">{item.trim()}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Project Plan
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          AI-generated plan to build, market, and scale your project.
        </p>

        {!historyId && (
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
            <Lightbulb className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Project Selected</h3>
            <p className="text-slate-600">
              Please go back to the history sidebar and click the "Brief" button on a project idea.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Generating your project plan with Gemini...</p>
            <p className="text-sm text-slate-500 mt-2">This may take a few moments.</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center">
              <ServerCrash className="w-6 h-6 mr-3" />
              <div>
                <h4 className="font-bold">Failed to Generate Plan</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {plan && (
          <PlanDisplay plan={plan} />
        )}
      </div>
    </div>
  );
}

export default function PlanningPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanningPageContent />
    </Suspense>
  );
}