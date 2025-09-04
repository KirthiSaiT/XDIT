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
As an experienced tech lead and startup advisor, analyze this project idea and provide a clear, conversational development plan without any markdown formatting or thinking tags:

**Project:** ${idea.title}
**Description:** ${idea.description}
**Tech Stack:** ${idea.techStack?.join(', ') || 'Not specified'}
**Difficulty:** ${idea.difficulty}

Provide a practical plan in these sections:

## Problem & Solution
First, clearly explain the core problem this project solves. Then describe your proposed solution and why it's needed in the market.

## Technical Requirements

### Frontend
List the recommended frontend technologies, frameworks, and libraries.

### Backend
Specify the backend technologies, APIs, and server requirements.

### Database
Recommend database solutions and data storage approaches.

### Additional Tools & APIs
List any third-party services, API keys needed (payment, AI, maps, etc.), and development tools.

### AI/ML Components
If applicable, specify the type of models needed, training approaches, and ML tools required.

## Development Plan
Outline the MVP features for the first 2-3 months, followed by core features for the next 3-6 months. Include key technical challenges and solutions.

## Market & Revenue Analysis
Provide realistic market size data, growth potential, revenue projections for the first year, and monetization strategies. Include competition analysis.

## Business Viability Assessment
Assess the startup potential, required funding/investment, key success metrics, and main risk factors.

Write in a conversational tone as if explaining to a colleague. Avoid markdown symbols, bullet points with asterisks, and technical jargon. Use clear, simple language and organize information logically.`;

  try {
    const messages = [
        {
            role: 'system',
            content: 'You are a practical tech lead and startup advisor. Provide clear, conversational development plans without any markdown formatting, thinking tags, or technical symbols. Write as if explaining to a colleague in plain English. Do not use asterisks, bullet points with symbols, or any markdown. Organize content with clear headings and readable paragraphs. Never include thinking process or meta-commentary - provide direct, actionable advice only.'
        },
        {
            role: 'user',
            content: prompt
        }
    ] as const;

    // Use PERPLEXITY_API_KEY2 for brief generation
    const perplexityResponse = await PerplexityService.chat([...messages], 'sonar-reasoning-pro', true);
    const plan = perplexityResponse.choices[0].message.content || "No plan generated.";

    await DatabaseService.updateProjectIdea(historyId, { plan });

    return NextResponse.json({ plan });

  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to generate plan from Perplexity API", details: errorMessage }, { status: 500 });
  }
}
