// src/app/api/planning/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/backend/services/database";
import { IProjectIdea } from "@/backend/models/ProjectIdea";
import { PerplexityService } from "@/backend/services/perplexity";

export async function GET(req: NextRequest) {
  const historyId = req.nextUrl.searchParams.get("historyId");
  if (!historyId) {
    return NextResponse.json({ error: "Missing historyId" }, { status: 400 });
  }

  const idea: IProjectIdea | null = await DatabaseService.getProjectIdeaById(historyId);
  if (!idea) {
    return NextResponse.json({ error: "Project idea not found" }, { status: 404 });
  }

  if (idea.plan) {
    return NextResponse.json({ plan: idea.plan });
  }

  const prompt = `
You are a world-class product manager, tech lead, and marketing strategist. Given the following project idea, provide an exhaustive and detailed plan on how to build, strategize, and market it. Format your response using Markdown for clear headings, lists, and emphasis.

**Project Idea:** ${idea.title}
**Description:** ${idea.description}
**Suggested Tech Stack:** ${idea.techStack?.join(', ') || 'Not specified'}
**Difficulty:** ${idea.difficulty}

Provide a comprehensive and actionable plan covering the following sections in great detail:

# 1. Technical Architecture
## High-level Overview
A diagram or a textual description of the overall system architecture (e.g., microservices, monolithic).
## Frontend
Recommended framework (e.g., React, Vue, Svelte) with reasons, key libraries for state management, UI components, and testing.
## Backend
Recommended framework (e.g., Node.js with Express, Python with Django/FastAPI) with reasons, API design principles (e.g., REST, GraphQL), and authentication strategy.
## Database
Recommended database (e.g., PostgreSQL, MongoDB, Firebase) with reasons, and a sample schema for the main collections/tables.
## Third-party Services
Key third-party APIs and services to integrate (e.g., for payments, emails, analytics).
## Deployment & Hosting
Recommended cloud provider (e.g., AWS, Vercel, Netlify) and a CI/CD pipeline setup.

# 2. Team Roles & Responsibilities
## Core Team (MVP)
A list of essential roles for the initial phase with their primary responsibilities.
## Extended Team (Post-MVP)
Roles to hire as the product grows.
## Skills Matrix
A brief overview of the key skills required for the technical team.

# 3. Development Timeline & Milestones
## Phase 1: MVP (0-3 Months)
A detailed breakdown of features for the MVP, with weekly sprints or milestones.
## Phase 2: Core Features (3-6 Months)
Key features to be added after the MVP launch.
## Phase 3: V2 & Scaling (6-12 Months)
Long-term features and infrastructure scaling plans.

# 4. Go-to-Market (GTM) Strategy
## Target Audience
Detailed user personas with their pain points and motivations.
## Pricing Strategy
A tiered pricing model (e.g., Free, Pro, Enterprise) with features for each tier.
## Marketing Channels
A mix of organic (content marketing, SEO, social media) and paid (PPC, social media ads) with a suggested budget allocation.
## Launch Plan
A step-by-step plan for a successful product launch (e.g., pre-launch, launch day, post-launch activities).

# 5. Growth & Scaling Strategy
## User Acquisition
Strategies to acquire the first 100, 1,000, and 10,000 users.
## User Retention
Strategies to keep users engaged and reduce churn.
## Product Roadmap
A long-term product roadmap with potential new features and integrations.
## Key Metrics (KPIs)
A list of key performance indicators to track for business success (e.g., MRR, LTV, CAC, Churn Rate).
`;

  try {
    const messages = [
        {
            role: 'system',
            content: 'You are a world-class product manager, tech lead, and marketing strategist. Your goal is to provide an exhaustive and detailed plan on how to build, strategize, and market a project idea. Format your response using Markdown for clear headings, lists, and emphasis.'
        },
        {
            role: 'user',
            content: prompt
        }
    ];

    const perplexityResponse = await PerplexityService.chat(messages, 'sonar-reasoning-pro');
    const plan = perplexityResponse.choices[0].message.content || "No plan generated.";

    await DatabaseService.updateProjectIdea(historyId, { plan });

    return NextResponse.json({ plan });

  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to generate plan from Perplexity API", details: errorMessage }, { status: 500 });
  }
}
