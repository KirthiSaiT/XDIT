import { NextRequest, NextResponse } from 'next/server'
import { extractKeywords } from '../../../backend/services/gemini'
import { scrapeReddit } from '../../../backend/services/reddit-scraper'
import { scrapeX } from '../../../backend/services/x-scraper'
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

    // Step 2: Scrape data from Reddit and X in parallel
    console.log('🌐 Step 2: Starting data scraping...')
    const [redditData, xData] = await Promise.allSettled([
      scrapeReddit(keywords),
      scrapeX(keywords)
    ])

    // Process scraping results
    const redditContent = redditData.status === 'fulfilled' ? redditData.value : []
    const xContent = xData.status === 'fulfilled' ? xData.value : []

    console.log('✅ Data scraping completed:')
    console.log(`   📊 Reddit posts: ${redditContent.length}`)
    console.log(`   🐦 X posts: ${xContent.length}`)

    if (redditData.status === 'rejected') {
      console.warn('⚠️ Reddit scraping failed:', redditData.reason)
    }

    if (xData.status === 'rejected') {
      console.warn('⚠️ X scraping failed:', xData.reason)
    }

    // Step 3: Generate project ideas based on scraped data
    console.log('💡 Step 3: Generating project ideas...')
    let projectIdeas
    
    try {
      projectIdeas = await generateProjectIdeas(prompt, keywords, redditContent, xContent)
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
        projectIdeas,
        sources: {
          reddit: redditContent.length,
          x: xContent.length
        }
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