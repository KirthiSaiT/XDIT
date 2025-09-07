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
Analyze this project idea and provide a comprehensive business analysis for Indian students and young entrepreneurs. Write everything as clean, flowing paragraphs without any special formatting, bullet points, or section breaks.

**Project:** ${idea.title}
**Description:** ${idea.description}
**Tech Stack:** ${idea.techStack?.join(', ') || 'Not specified'}
**Difficulty:** ${idea.difficulty}

Provide a detailed analysis covering the problem this solves, the solution approach, technical requirements for building it, market opportunity in India, how to make money from it, competition analysis, legal considerations, funding strategy, launch plan, revenue expectations, potential risks, and success measurements. 

Write everything as one continuous explanation without using any special characters, markdown formatting, bullet points, or section headers. Use simple conversational language that Indian students can easily understand. Include specific examples from the Indian startup ecosystem, mention real Indian companies doing similar work, use Indian rupee amounts that make sense for students and young entrepreneurs, and reference current trends in the Indian digital market like UPI payments, smartphone usage, and online education growth.

Focus on practical advice for building and launching this in India, including which Indian cities to target, how to reach Indian customers through platforms they actually use, pricing strategies that work for Indian purchasing power, and funding options available to Indian students and young entrepreneurs. Mention government initiatives like Startup India, popular Indian payment methods, and successful Indian startups in similar domains.

Avoid all technical jargon, business acronyms, complex financial terms, and corporate language. Write as if explaining to a friend who wants to start their first business in India. Make it encouraging and practical with real-world examples and actionable steps.`;

  try {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful mentor for Indian students and young entrepreneurs. Explain everything in simple, flowing paragraphs without any special formatting, section headers, bullet points, or markdown. Never use special characters like hashtags, asterisks, underscores, or any formatting symbols. Write as one continuous conversation using normal text only. Focus on practical advice for Indian students, use Indian rupee amounts, mention real Indian companies and market conditions, and avoid all business jargon. Make it encouraging and easy to understand for someone starting their first business in India.'
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
