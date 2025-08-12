import { NextRequest, NextResponse } from 'next/server'
import { extractKeywords } from '../../../backend/services/perplexity'

import { generateProjectIdeas } from '../../../backend/services/idea-generator'

export async function POST(request: NextRequest) {
  try {
    console.log('=== API Request Started ===')
    const { prompt } = await request.json()
    
    if (!prompt || typeof prompt !== 'string') {
      console.log('Invalid prompt provided:', prompt)
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      )
    }

    console.log('✅ Valid prompt received:', prompt)

    // Step 1: Extract keywords using Gemini API
    console.log('🔍 Step 1: Extracting keywords using Gemini API...')
    let keywords: string[] = []
    
    try {
      keywords = await extractKeywords(prompt)
      console.log('✅ Keywords extracted successfully:', keywords)
    } catch (keywordError) {
      console.error('❌ Keyword extraction failed:', keywordError)
      return NextResponse.json(
        { error: 'Failed to extract keywords. Please check your API key.' },
        { status: 500 }
      )
    }
    
    if (!keywords || keywords.length === 0) {
      console.log('❌ No keywords extracted')
      return NextResponse.json(
        { error: 'No keywords could be extracted from your prompt' },
        { status: 500 }
      )
    }

    // Step 2: No scraping needed, Perplexity AI will handle web search internally

    // Step 3: Generate project ideas based on AI analysis
    console.log('💡 Step 3: Generating project ideas...')
    let projectIdeas
    
    try {
      projectIdeas = await generateProjectIdeas(prompt, keywords)
      console.log('✅ Project ideas generated successfully:', projectIdeas.length, 'ideas')
    } catch (ideaError) {
      console.error('❌ Project idea generation failed:', ideaError)
      return NextResponse.json(
        { error: 'Failed to generate project ideas. Please try again.' },
        { status: 500 }
      )
    }

    const response = {
      success: true,
      data: {
        keywords,
        projectIdeas
      }
    }

    console.log('🎉 API Request completed successfully!')
    console.log('=== API Response ===')
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Fatal error in generate-ideas API:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available')
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please check the console for details.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
} 