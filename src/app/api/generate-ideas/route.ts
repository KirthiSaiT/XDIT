import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PerplexityService } from "@/backend/services/perplexity";
import { generateProjectIdeas } from "@/backend/services/idea-generator";
import { DatabaseService } from "@/backend/services/database";
import { IProjectIdea } from "@/backend/models/ProjectIdea";

// Interface for the incoming request payload
interface GenerateRequest {
  prompt: string;
  keywords?: string[];
  options?: {
    maxIdeas?: number;
    temperature?: number;
    techFilter?: string[];
  };
}

// Interface for the project ideas sent to the frontend
interface ProjectIdea {
  idea: string; // Frontend expects 'idea', not 'title'
  description: string;
  techStack: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  marketNeed: string;
  marketValue: string;
  sourceLinks: string[];
  _id: string;
  createdAt: string;
  keywords: string[];
  sources: {
    title?: string;
    url?: string;
    snippet?: string;
    source?: string;
  }[];
}

// Interface for the final API response
interface GenerateResponse {
  success: boolean;
  data?: {
    keywords: string[];
    projectIdeas: ProjectIdea[];
  };
  error?: string;
}

// Type guard function to ensure difficulty is valid
function isValidDifficulty(difficulty: string | undefined): difficulty is "Easy" | "Medium" | "Hard" {
  return difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard";
}

// Interface for source items from the backend service
interface SourceItem {
  title?: string;
  url: string;
}

// Interface for the raw idea structure from the idea generation service
interface BackendIdea {
  _id?: string;
  idea: string; // This will be mapped to 'title'
  description: string;
  marketNeed?: string;
  marketValue?: string;
  techStack?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  estimatedTime?: string;
  sources?: SourceItem[];
}

export async function POST(
  request: Request
): Promise<NextResponse<GenerateResponse>> {
  try {
    const payload = (await request.json()) as GenerateRequest;

    if (!payload.prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 }
      );
    }

    // Authenticate the user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const { prompt, keywords } = payload;

    console.log("Generating ideas for prompt:", prompt);
    console.log("User ID:", userId);

    // Extract keywords from the prompt if not provided
    let extractedKeywords = keywords || [];
    if (extractedKeywords.length === 0) {
      console.log("Extracting keywords from prompt...");
      extractedKeywords = await PerplexityService.extractKeywords(prompt);
      console.log("Keywords extracted:", extractedKeywords);
    }

    // Generate project ideas using the backend service
    const ideas = (await generateProjectIdeas(
      prompt,
      extractedKeywords
    )) as BackendIdea[];

    // Aggregate keywords from various sources for better tagging
    const promptKeywords = prompt
      .toLowerCase()
      .split(" ")
      .filter((word: string) => word.length > 3);
    const researchKeywords = ideas
      .flatMap(
        (idea) =>
          idea.sources?.map((source) => source.title || source.url) ||
          []
      )
      .filter(Boolean);

    const allKeywords = [...new Set([...promptKeywords, ...researchKeywords])];

    // Fallback to ensure some keywords are always present
    if (allKeywords.length === 0) {
      allKeywords.push(
        ...extractedKeywords,
        ...prompt
          .toLowerCase()
          .split(" ")
          .filter((word: string) => word.length > 2)
          .slice(0, 5)
      );
    }

    // Save the generated ideas to the database and get the actual MongoDB IDs
    const savedIdeas: IProjectIdea[] = [];
    try {
      for (const idea of ideas) {
        const savedIdea = await DatabaseService.createProjectIdea({
          title: idea.idea,
          description: idea.description,
          techStack: idea.techStack,
          difficulty: idea.difficulty,
          estimatedTime: idea.estimatedTime,
          marketValue: idea.marketValue,
          sources: idea.sources,
          keywords: allKeywords,
          isPublic: true,
          status: "published",
          userId: userId,
        });
        savedIdeas.push(savedIdea);
      }
      console.log(`✅ Saved ${savedIdeas.length} ideas to MongoDB for user ${userId}`);
    } catch (dbError) {
      console.error("❌ Error saving ideas to MongoDB:", dbError);
      // Return error if database save fails since we need the proper IDs
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save ideas to database",
        },
        { status: 500 }
      );
    }

    // Transform the backend idea structure to match the frontend's expected structure
    // Use the actual MongoDB IDs from the saved ideas with proper type safety
    const transformedIdeas: ProjectIdea[] = savedIdeas.map((savedIdea) => {
      // Ensure difficulty is properly typed using type guard
      const difficulty: "Easy" | "Medium" | "Hard" = isValidDifficulty(savedIdea.difficulty) 
        ? savedIdea.difficulty 
        : "Medium";
      
      // Clean and filter source URLs
      const sourceLinks = savedIdea.sources
        ?.map((source) => source.url)
        .filter((url): url is string => typeof url === 'string' && url.length > 0) || [];
      
      // Ensure all required fields have proper values
      return {
        idea: savedIdea.title || 'Untitled Project', // Map title back to idea for frontend compatibility
        description: savedIdea.description || 'No description available',
        marketNeed: savedIdea.marketValue || 'Market analysis pending', // Use marketValue as marketNeed for frontend compatibility
        marketValue: savedIdea.marketValue || 'Value assessment pending',
        techStack: savedIdea.techStack || [],
        difficulty,
        estimatedTime: savedIdea.estimatedTime || 'Time estimate pending',
        sourceLinks,
        _id: String(savedIdea._id), // Use the actual MongoDB ObjectId
        createdAt: (savedIdea.createdAt as Date).toISOString(),
        keywords: savedIdea.keywords || [],
        sources: savedIdea.sources || [],
      };
    });

    console.log(
      `Generated ${transformedIdeas.length} ideas with ${allKeywords.length} keywords`
    );

    // Return a successful response with the keywords and transformed ideas
    const response: GenerateResponse = {
      success: true,
      data: {
        keywords: allKeywords,
        projectIdeas: transformedIdeas,
      },
    };
    
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("❌ Failed to generate ideas:", error);
    
    // Type-safe error handling
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as { message: unknown }).message);
    }
    
    const errorResponse: GenerateResponse = {
      success: false,
      error: errorMessage,
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}