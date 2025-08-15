import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/backend/services/database";
import { IProjectIdea } from "@/backend/models/ProjectIdea";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET(req: NextRequest) {
  const historyId = req.nextUrl.searchParams.get("historyId");
  if (!historyId) {
    return NextResponse.json({ error: "Missing historyId" }, { status: 400 });
  }

  // Fetch the project idea from DB
  const idea: IProjectIdea | null = await DatabaseService.getProjectIdeaById(historyId);
  if (!idea) {
    return NextResponse.json({ error: "Project idea not found" }, { status: 404 });
  }

  // Compose prompt for Gemini
  const prompt = `
You are a world-class product manager and tech lead. Given the following project idea, provide a detailed plan on how to build, strategize, and market it.

**Project Idea:** ${idea.idea}

**Description:** ${idea.description}

**Market Need:** ${idea.marketNeed}

**Suggested Tech Stack:** ${idea.techStack.join(', ')}

**Difficulty:** ${idea.difficulty}

**Estimated Time:** ${idea.estimatedTime}

Provide a comprehensive plan covering the following sections:

1.  **Technical Architecture:**
    *   High-level overview of the architecture.
    *   Recommended frontend and backend frameworks.
    *   Database choice and schema design.
    *   Key third-party services and APIs to integrate.
    *   Deployment and hosting strategy.

2.  **Team Roles & Responsibilities:**
    *   Essential roles needed for the initial team (e.g., Frontend Developer, Backend Developer, UI/UX Designer, Product Manager).
    *   Key responsibilities for each role.

3.  **Development Timeline & Milestones:**
    *   A realistic timeline broken down into phases (e.g., Phase 1: MVP, Phase 2: Core Features, Phase 3: V2).
    *   Key milestones and deliverables for each phase.

4.  **Go-to-Market (GTM) Strategy:**
    *   Target audience and user personas.
    *   Pricing strategy and monetization model.
    *   Marketing channels to focus on (e.g., content marketing, social media, SEO, paid ads).
    *   Launch plan and initial user acquisition strategy.

5.  **Growth & Scaling Strategy:**
    *   Strategies to scale the user base after launch.
    *   Long-term feature roadmap and product evolution.
    *   Key metrics to track for success.
`;

  try {
    // Call Gemini Pro API
    const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": `${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        }),
    });

    if (!geminiRes.ok) {
        const errorData = await geminiRes.json();
        console.error("Gemini API Error:", errorData);
        return NextResponse.json({ error: "Failed to generate plan from Gemini API", details: errorData }, { status: geminiRes.status });
    }

    const geminiData = await geminiRes.json();
    const plan = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No plan generated.";

    return NextResponse.json({ plan });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
