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
As an experienced tech lead, startup advisor, and business strategist, analyze this project idea and provide a comprehensive business intelligence report without any markdown formatting or thinking tags:

**Project:** ${idea.title}
**Description:** ${idea.description}
**Tech Stack:** ${idea.techStack?.join(', ') || 'Not specified'}
**Difficulty:** ${idea.difficulty}

Provide a detailed analysis in these sections:

## Problem & Solution
Clearly explain the core problem this project solves and describe your proposed solution with market positioning.

## Technical Requirements

### Frontend
List recommended frontend technologies, frameworks, and libraries with reasoning.

### Backend
Specify backend technologies, APIs, server requirements, and scalability considerations.

### Database
Recommend database solutions, data storage approaches, and data architecture.

### Additional Tools & APIs
List third-party services, API keys needed, development tools, and integration requirements.

### AI/ML Components
If applicable, specify model types, training approaches, ML tools, and data requirements.

## Patent Analysis & IP Protection
Analyze potential patent conflicts, existing patents in this space, intellectual property opportunities, trademark considerations, and IP protection strategies.

## Competitive Landscape Analysis
Identify direct competitors, indirect competitors, competitive advantages, market differentiation strategies, and competitive threats. Include specific company names and their approaches.

## Legal & Compliance Requirements
Outline regulatory compliance needs, data privacy requirements (GDPR, CCPA), terms of service considerations, liability concerns, and legal entity recommendations.

## Fundraising Strategy
Explain how much money you will need to start and grow this business in India, using simple rupee amounts (like 10 lakhs for initial setup, 50 lakhs for growth). Describe where to find investors in India (angel investors, venture capital firms, government schemes like Startup India), what percentage of company to give away, and how to convince Indian investors. Include realistic timelines for raising money and what investors will want to see before investing in Indian startups.

## Go-to-Market & Launch Strategy
Create a practical launch plan for the Indian market. Explain the best ways to reach Indian customers, which online platforms work best in India (like WhatsApp Business, Instagram, Facebook), how to price the product affordably for Indian customers, and which Indian cities to target first. Include partnerships with Indian companies, influencer marketing strategies that work in India, and how to handle customer support in multiple Indian languages.

## Market & Revenue Analysis
Provide a simple analysis of the Indian market opportunity. Explain how big the market is in India, what Indian customers are willing to pay in rupees, realistic monthly and yearly revenue expectations in Indian rupees, and how similar Indian startups are making money. Include current trends in the Indian digital market, popular payment methods Indians prefer (UPI, Paytm, etc.), and seasonal buying patterns in India.

## Risk Assessment & Mitigation
Identify the main challenges of building this business in India. Explain competition from other Indian companies, regulatory hurdles with Indian government policies, technical challenges with Indian internet infrastructure, and financial risks. Provide simple solutions for each problem that make sense for the Indian market.

## Success Metrics & KPIs
Define simple success measurements that matter for Indian startups. Explain what numbers to track (like monthly users, revenue in rupees, customer satisfaction), realistic growth targets for Indian market, and when to consider the startup successful. Use Indian startup examples and benchmarks that entrepreneurs can understand and relate to.

Write in a friendly, conversational tone using simple language. Include real examples of successful Indian startups in similar industries, current market trends in India (like UPI adoption, smartphone penetration, digital payment growth), and practical advice based on the ground reality of doing business in India. Avoid all technical jargon, business acronyms, and complex financial terms. Use rupee amounts that make sense for Indian entrepreneurs and reference real Indian companies and market conditions.`;

  try {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful business advisor who explains things in simple, clear language that any entrepreneur can understand. Avoid technical jargon, business acronyms (like ARR, MRR, CAC, LTV, etc.), and complex terminology. Write as if talking to a friend who is starting their first business. Use simple words, real examples, and practical advice. For financial information, always use Indian Rupees (INR) and explain costs in lakhs/crores that Indians understand. Reference real Indian companies, current Indian market trends, and practical challenges faced by Indian startups. Make everything conversational and easy to read.'
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
