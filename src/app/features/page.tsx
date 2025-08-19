"use client";

import React, { useState } from "react";
import { Brain, History, FileText, Share2 } from "lucide-react";

type Feature = {
  id: string;
  title: string;
  icon: React.ReactNode;
  short: string;
  details: string;
};

const FEATURES: Feature[] = [
  {
    id: "ideate",
    title: "AI-Powered Ideation",
    icon: <Brain className="w-6 h-6" />,
    short: "Generate unique startup and project ideas using advanced AI",
    details: `Our AI combines data from multiple sources:
    • Reddit discussions and trends
    • X/Twitter conversations
    • Public forums and communities
    
    Each idea comes with:
    • Detailed description
    • Market validation
    • Technical feasibility
    • Resource requirements`
  },
  {
    id: "history",
    title: "Project History",
    icon: <History className="w-6 h-6" />,
    short: "Track and revisit all your generated ideas",
    details: `Keep track of every idea you've generated:
    • Access your full idea history
    • Review past project concepts
    • Generate detailed plans for any saved idea
    • Track idea evolution over time`
  },
  {
    id: "planning",
    title: "Comprehensive Planning",
    icon: <FileText className="w-6 h-6" />,
    short: "Turn ideas into detailed project plans",
    details: `Get detailed project plans including:
    • Technical architecture
    • Team requirements
    • Development timeline
    • Market strategy
    • Growth tactics
    • Risk assessment`
  },
  {
    id: "share",
    title: "Share & Export",
    icon: <Share2 className="w-6 h-6" />,
    short: "Export and share your project plans",
    details: `Share your ideas and plans:
    • Export as PDF or Markdown
    • Share with team members
    • Collaborate on plans
    • Track feedback and iterations`
  }
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            How XDIT Works
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Generate, plan, and execute your next big project idea
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature List */}
          <div className="space-y-4">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  activeFeature?.id === feature.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{feature.short}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feature Details */}
          <div className="md:col-span-2">
            {activeFeature ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-blue-600">{activeFeature.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeFeature.title}
                    </h2>
                    <p className="text-gray-500 mt-1">{activeFeature.short}</p>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                    {activeFeature.details}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                Select a feature to learn more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}