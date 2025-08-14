import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server';
import { PerplexityService } from '@/backend/services/perplexity'
import { generateProjectIdeas } from '@/backend/services/idea-generator'
import { DatabaseService } from '@/backend/services/database'

export async function POST(request: Request) {
  try {
    // Use currentUser() instead of auth() for better reliability
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { prompt, keywords } = await request.json()

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      }, { status: 400 })
    }

    console.log('Generating ideas for prompt:', prompt);
    console.log('User ID:', userId);

    // Extract keywords if not provided
    let extractedKeywords = keywords || [];
    if (extractedKeywords.length === 0) {
      console.log('Extracting keywords from prompt...');
      extractedKeywords = await PerplexityService.extractKeywords(prompt);
      console.log('Keywords extracted:', extractedKeywords);
    }

    // Generate project ideas
    const ideas = await generateProjectIdeas(prompt, extractedKeywords)

    // Transform backend properties to match frontend interface
    const transformedIdeas = ideas.map(idea => ({
      idea: idea.idea,
      description: idea.description,
      market_need: idea.marketNeed,
      tech_stack: idea.techStack,
      difficulty: idea.difficulty,
      estimated_time: idea.estimatedTime,
      sources: idea.sources || []
    }))

    // Extract keywords from the prompt and add any from research
    const promptKeywords = prompt.toLowerCase().split(' ').filter((word: string) => word.length > 3);
    const researchKeywords = ideas.flatMap(idea =>
      idea.sources?.map((source: any) => source.title || source.url) || []
    ).filter(Boolean);

    const allKeywords = [...new Set([...promptKeywords, ...researchKeywords])];

    // Save ideas to MongoDB
    try {
      for (const idea of ideas) {
        await DatabaseService.createProjectIdea({
          idea: idea.idea,
          description: idea.description,
          marketNeed: idea.marketNeed,
          techStack: idea.techStack,
          difficulty: idea.difficulty,
          estimatedTime: idea.estimatedTime,
          sources: idea.sources || [],
          keywords: allKeywords,
          isPublic: true,
          status: 'published',
          userId: userId
        })
      }
      console.log(`✅ Saved ${ideas.length} ideas to MongoDB for user ${userId}`)
    } catch (dbError) {
      console.error('❌ Error saving ideas to MongoDB:', dbError)
      // Continue with the response even if database save fails
    }

    console.log(`Generated ${transformedIdeas.length} ideas with ${allKeywords.length} keywords`);

    return NextResponse.json({
      success: true,
      data: {
        keywords: allKeywords,
        projectIdeas: transformedIdeas
      }
    })
  } catch (error) {
    console.error('Error in generate-ideas API route:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }, { status: 500 })
  }
} 