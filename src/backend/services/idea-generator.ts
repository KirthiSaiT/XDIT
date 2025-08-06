import { analyzeScrapedData } from './gemini'

interface RedditPost {
  title: string
  content: string
  url: string
  score: number
  subreddit: string
  created_utc: number
  num_comments: number
}

interface XPost {
  content: string
  url: string
  likes: number
  retweets: number
  replies: number
  created_at: string
  author: string
  verified: boolean
}

interface ProjectIdea {
  idea: string
  description: string
  marketNeed: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  sources: string[]
}

export async function generateProjectIdeas(
  prompt: string,
  keywords: string[],
  redditData: RedditPost[],
  xData: XPost[]
): Promise<ProjectIdea[]> {
  try {
    // First, get AI-generated ideas based on scraped data
    const aiIdeas = await analyzeScrapedData(prompt, keywords, redditData, xData)
    
    // Enhance the ideas with additional context and structure
    const enhancedIdeas = await Promise.all(
      aiIdeas.map(async (idea, index) => {
        return await enhanceIdea(idea, keywords, redditData, xData, index)
      })
    )
    
    return enhancedIdeas
    
  } catch (error) {
    console.error('Error generating project ideas:', error)
    
    // Fallback to basic ideas if AI fails
    return generateFallbackIdeas(prompt, keywords)
  }
}

async function enhanceIdea(
  idea: string,
  keywords: string[],
  redditData: RedditPost[],
  xData: XPost[],
  index: number
): Promise<ProjectIdea> {
  try {
    // Extract market need from scraped content
    const marketNeed = extractMarketNeed(redditData, xData, keywords)
    
    // Suggest tech stack based on keywords and trends
    const techStack = suggestTechStack(keywords, idea)
    
    // Determine difficulty and time estimate
    const { difficulty, estimatedTime } = assessComplexity(idea, techStack)
    
    // Find relevant sources
    const sources = findRelevantSources(redditData, xData, keywords).slice(0, 3)
    
    return {
      idea: idea.trim(),
      description: generateDescription(idea, keywords),
      marketNeed,
      techStack,
      difficulty,
      estimatedTime,
      sources: sources.map(source => source.url || source.title || 'Reddit/X Discussion')
    }
    
  } catch (error) {
    console.error('Error enhancing idea:', error)
    
    // Return basic enhanced idea
    return {
      idea: idea.trim(),
      description: `A ${keywords.join(', ')} solution that addresses modern business needs.`,
      marketNeed: 'Based on current market discussions and trends',
      techStack: ['React', 'Node.js', 'MongoDB'],
      difficulty: 'Medium' as const,
      estimatedTime: '2-3 months',
      sources: []
    }
  }
}

function extractMarketNeed(redditData: RedditPost[], xData: XPost[], keywords: string[]): string {
  // Analyze posts for pain points and needs
  const painPoints: string[] = []
  
  // Look for common pain point indicators in Reddit posts
  redditData.forEach(post => {
    const text = (post.title + ' ' + post.content).toLowerCase()
    
    if (text.includes('problem') || text.includes('issue') || text.includes('struggle')) {
      painPoints.push(post.title)
    }
    if (text.includes('need') || text.includes('want') || text.includes('looking for')) {
      painPoints.push(post.title)
    }
  })
  
  // Look for needs in X posts
  xData.forEach(post => {
    const text = post.content.toLowerCase()
    
    if (text.includes('need') || text.includes('looking for') || text.includes('problem')) {
      painPoints.push(post.content.substring(0, 100))
    }
  })
  
  if (painPoints.length > 0) {
    return `Addresses common challenges including: ${painPoints.slice(0, 2).join(', ')}`
  }
  
  return `Solves emerging needs in the ${keywords.join(', ')} space based on community discussions`
}

function suggestTechStack(keywords: string[], idea: string): string[] {
  const baseStack = ['React', 'Node.js', 'TypeScript']
  const additionalTech: string[] = []
  
  const ideaLower = idea.toLowerCase()
  const keywordsLower = keywords.map(k => k.toLowerCase())
  
  // AI/ML related
  if (keywordsLower.some(k => k.includes('ai') || k.includes('ml') || k.includes('machine learning'))) {
    additionalTech.push('Python', 'TensorFlow', 'OpenAI API')
  }
  
  // Mobile related
  if (keywordsLower.some(k => k.includes('mobile') || k.includes('app'))) {
    additionalTech.push('React Native', 'Expo')
  }
  
  // Data/Analytics related
  if (keywordsLower.some(k => k.includes('data') || k.includes('analytics') || k.includes('dashboard'))) {
    additionalTech.push('D3.js', 'Chart.js', 'PostgreSQL')
  }
  
  // Real-time features
  if (ideaLower.includes('real-time') || ideaLower.includes('live') || ideaLower.includes('instant')) {
    additionalTech.push('Socket.io', 'WebRTC')
  }
  
  // Payment related
  if (ideaLower.includes('payment') || ideaLower.includes('billing') || ideaLower.includes('subscription')) {
    additionalTech.push('Stripe', 'PayPal API')
  }
  
  // Authentication
  if (ideaLower.includes('user') || ideaLower.includes('account') || ideaLower.includes('profile')) {
    additionalTech.push('Auth0', 'JWT')
  }
  
  return [...baseStack, ...additionalTech].slice(0, 6)
}

function assessComplexity(idea: string, techStack: string[]): { difficulty: 'Easy' | 'Medium' | 'Hard', estimatedTime: string } {
  let complexityScore = 0
  
  const ideaLower = idea.toLowerCase()
  
  // Increase complexity for certain features
  if (ideaLower.includes('ai') || ideaLower.includes('machine learning')) complexityScore += 3
  if (ideaLower.includes('real-time') || ideaLower.includes('live')) complexityScore += 2
  if (ideaLower.includes('mobile')) complexityScore += 2
  if (ideaLower.includes('payment') || ideaLower.includes('billing')) complexityScore += 2
  if (ideaLower.includes('integration') || ideaLower.includes('api')) complexityScore += 1
  if (ideaLower.includes('analytics') || ideaLower.includes('dashboard')) complexityScore += 1
  
  // Factor in tech stack complexity
  complexityScore += Math.floor(techStack.length / 2)
  
  if (complexityScore <= 2) {
    return { difficulty: 'Easy', estimatedTime: '2-4 weeks' }
  } else if (complexityScore <= 5) {
    return { difficulty: 'Medium', estimatedTime: '1-3 months' }
  } else {
    return { difficulty: 'Hard', estimatedTime: '3-6 months' }
  }
}

function generateDescription(idea: string, keywords: string[]): string {
  const ideaLower = idea.toLowerCase()
  
  if (ideaLower.includes('platform')) {
    return `A comprehensive platform that leverages ${keywords.join(', ')} to streamline operations and improve efficiency for businesses and individuals.`
  } else if (ideaLower.includes('app') || ideaLower.includes('mobile')) {
    return `A mobile-first application focusing on ${keywords.join(', ')} that provides users with intuitive tools and seamless experience.`
  } else if (ideaLower.includes('dashboard') || ideaLower.includes('analytics')) {
    return `An analytics-driven solution that helps users understand and optimize their ${keywords.join(', ')} performance through data visualization.`
  } else if (ideaLower.includes('automation')) {
    return `An automation tool that simplifies ${keywords.join(', ')} workflows, reducing manual work and increasing productivity.`
  } else {
    return `An innovative solution that addresses key challenges in the ${keywords.join(', ')} domain through modern technology and user-centric design.`
  }
}

function findRelevantSources(redditData: RedditPost[], xData: XPost[], keywords: string[]): Array<{ url?: string, title?: string }> {
  const sources: Array<{ url?: string, title?: string }> = []
  
  // Add high-scoring Reddit posts
  redditData
    .filter(post => post.score > 10)
    .slice(0, 2)
    .forEach(post => {
      sources.push({ url: post.url, title: post.title })
    })
  
  // Add high-engagement X posts
  xData
    .filter(post => post.likes > 5)
    .slice(0, 2)
    .forEach(post => {
      sources.push({ url: post.url, title: post.content.substring(0, 50) + '...' })
    })
  
  return sources
}

function generateFallbackIdeas(prompt: string, keywords: string[]): ProjectIdea[] {
  const fallbackIdeas = [
    `Build a ${keywords[0] || 'productivity'} management platform for small businesses`,
    `Create an AI-powered ${keywords[1] || 'automation'} tool for ${keywords[0] || 'workflows'}`,
    `Develop a mobile app for ${keywords[0] || 'professionals'} networking and collaboration`,
    `Design a dashboard for ${keywords[0] || 'data'} analytics and insights`,
    `Launch a marketplace connecting ${keywords[0] || 'service'} providers with customers`
  ]
  
  return fallbackIdeas.map((idea, index) => ({
    idea,
    description: `A solution addressing needs in the ${keywords.join(', ')} space.`,
    marketNeed: 'Based on general market trends and user feedback',
    techStack: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    difficulty: 'Medium' as const,
    estimatedTime: '2-3 months',
    sources: []
  }))
} 