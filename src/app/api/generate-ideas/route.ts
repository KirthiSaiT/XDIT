import { NextResponse } from 'next/server'
import { PerplexityService } from '@/backend/services/perplexity'
import { generateProjectIdeas } from '@/backend/services/idea-generator'

export async function POST(request: Request) {
  try {
    const { prompt, keywords } = await request.json()

    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prompt is required' 
      }, { status: 400 })
    }

    console.log('Generating ideas for prompt:', prompt);
    
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