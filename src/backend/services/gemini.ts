import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY environment variable is required')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      if (i === maxRetries - 1) throw error
      
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000
        console.log(`⏳ Rate limited, retrying in ${Math.round(delay)}ms... (attempt ${i + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw error // Don't retry non-quota errors
      }
    }
  }
  throw new Error('Max retries exceeded')
}

// Fallback keyword extraction using simple text analysis
function extractKeywordsFromText(prompt: string): string[] {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'])
  
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
  
  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Get top keywords
  const keywords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
  
  return keywords.length > 0 ? keywords : ['technology', 'automation', 'business', 'productivity']
}

export async function extractKeywords(prompt: string): Promise<string[]> {
  try {
    console.log('🔍 Attempting keyword extraction with Gemini Flash...')
    
    return await retryWithBackoff(async () => {
      // Use Flash model which has higher quota limits
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      const keywordExtractionPrompt = `Extract 3-5 keywords from: "${prompt}"
Return only keywords separated by commas. Focus on: technology, industry, domain, function.
Example: artificial intelligence, healthcare, automation, mobile app, productivity`

      const result = await model.generateContent(keywordExtractionPrompt)
      const response = await result.response
      const text = response.text().trim()
      
      // Parse keywords from the response
      const keywords = text
        .split(',')
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0)
        .slice(0, 5) // Limit to 5 keywords max
      
      if (keywords.length === 0) {
        throw new Error('No keywords extracted from AI response')
      }
      
      console.log('✅ AI keyword extraction successful:', keywords)
      return keywords
    })
    
  } catch (error: any) {
    console.warn('⚠️ AI keyword extraction failed, using fallback method:', error.message)
    
    // Fallback to simple text analysis
    const fallbackKeywords = extractKeywordsFromText(prompt)
    console.log('🔄 Fallback keywords extracted:', fallbackKeywords)
    
    return fallbackKeywords
  }
}

export async function analyzeScrapedData(
  prompt: string,
  keywords: string[],
  redditData: any[],
  xData: any[]
): Promise<string[]> {
  try {
    console.log('🤖 Attempting AI analysis with Gemini Flash...')
    
    return await retryWithBackoff(async () => {
      // Use Flash model for better quota management
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      const analysisPrompt = `Generate 5 SaaS ideas based on:
Prompt: "${prompt}"
Keywords: ${keywords.join(', ')}
Reddit data: ${redditData.slice(0, 5).map(post => post.title || post.content).join('. ')}
X data: ${xData.slice(0, 5).map(post => post.content).join('. ')}

Return 5 actionable SaaS ideas, one per line. Focus on real problems and feasible solutions.`

      const result = await model.generateContent(analysisPrompt)
      const response = await result.response
      const text = response.text().trim()
      
      // Parse ideas from the response
      const ideas = text
        .split('\n')
        .map((idea: string) => idea.trim())
        .filter((idea: string) => idea.length > 0)
        .slice(0, 5) // Ensure we only return 5 ideas
      
      if (ideas.length === 0) {
        throw new Error('No ideas generated from AI response')
      }
      
      console.log('✅ AI idea generation successful:', ideas.length, 'ideas')
      return ideas
    })
    
  } catch (error: any) {
    console.warn('⚠️ AI idea generation failed, using fallback method:', error.message)
    
    // Fallback idea generation
    const fallbackIdeas = generateFallbackIdeas(prompt, keywords, redditData, xData)
    console.log('🔄 Fallback ideas generated:', fallbackIdeas.length, 'ideas')
    
    return fallbackIdeas
  }
}

// Fallback idea generation when AI is unavailable
function generateFallbackIdeas(
  prompt: string,
  keywords: string[],
  redditData: any[],
  xData: any[]
): string[] {
  const primaryKeyword = keywords[0] || 'business'
  const secondaryKeyword = keywords[1] || 'automation'
  
  const templates = [
    `Build a ${primaryKeyword} management platform that automates ${secondaryKeyword} workflows for small businesses`,
    `Create an AI-powered ${primaryKeyword} assistant that helps teams optimize their ${secondaryKeyword} processes`,
    `Develop a mobile app that connects ${primaryKeyword} professionals with ${secondaryKeyword} solutions`,
    `Design a dashboard that provides ${primaryKeyword} analytics and ${secondaryKeyword} insights for decision makers`,
    `Launch a marketplace that matches ${primaryKeyword} service providers with businesses needing ${secondaryKeyword} solutions`
  ]
  
  // Add context from scraped data if available
  const problems = [
    ...redditData.slice(0, 3).map(post => post.title || post.content),
    ...xData.slice(0, 3).map(post => post.content)
  ]
  
  if (problems.length > 0) {
    templates[0] = `Build a ${primaryKeyword} solution addressing: "${problems[0]?.substring(0, 100)}..."`
  }
  
  return templates
} 