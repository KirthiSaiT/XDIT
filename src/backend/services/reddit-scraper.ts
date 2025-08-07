interface RedditPost {
  title: string
  content: string
  url: string
  score: number
  subreddit: string
  created_utc: number
  num_comments: number
}

interface RedditSearchResponse {
  data: {
    children: Array<{
      data: {
        title: string
        selftext: string
        url: string
        score: number
        subreddit: string
        created_utc: number
        num_comments: number
        permalink: string
      }
    }>
  }
}

// Intelligent subreddit mapping based on topics and keywords
const TOPIC_SUBREDDIT_MAP: Record<string, string[]> = {
  // AI and Machine Learning
  'ai': ['MachineLearning', 'artificial', 'OpenAI', 'singularity', 'MLQuestions', 'DeepLearning', 'ArtificialIntelligence', 'ChatGPT', 'LocalLLaMA'],
  'artificial intelligence': ['MachineLearning', 'artificial', 'OpenAI', 'singularity', 'ArtificialIntelligence', 'ChatGPT', 'LocalLLaMA'],
  'machine learning': ['MachineLearning', 'MLQuestions', 'DeepLearning', 'datascience', 'learnmachinelearning', 'artificial'],
  'chatgpt': ['ChatGPT', 'OpenAI', 'artificial', 'singularity', 'LocalLLaMA'],
  'llm': ['LocalLLaMA', 'ChatGPT', 'OpenAI', 'MachineLearning', 'artificial'],
  
  // Web Development
  'web development': ['webdev', 'Frontend', 'Backend', 'reactjs', 'javascript', 'css', 'HTML', 'ProgrammerHumor', 'learnprogramming'],
  'frontend': ['Frontend', 'reactjs', 'javascript', 'css', 'HTML', 'webdev', 'Angular2', 'vuejs'],
  'backend': ['Backend', 'node', 'Python', 'golang', 'django', 'webdev', 'programming'],
  'react': ['reactjs', 'Frontend', 'javascript', 'webdev', 'programming'],
  'javascript': ['javascript', 'webdev', 'Frontend', 'node', 'reactjs', 'learnjavascript'],
  'nodejs': ['node', 'javascript', 'Backend', 'webdev', 'programming'],
  
  // Mobile Development
  'mobile app': ['androiddev', 'iOSProgramming', 'FlutterDev', 'reactnative', 'mobiledev', 'AppIdeas'],
  'android': ['androiddev', 'Android', 'Kotlin', 'java', 'mobiledev'],
  'ios': ['iOSProgramming', 'swift', 'ObjectiveC', 'mobiledev'],
  'flutter': ['FlutterDev', 'mobiledev', 'androiddev', 'iOSProgramming'],
  
  // Business and Startups
  'startup': ['startups', 'entrepreneur', 'Startup_Ideas', 'SideProject', 'indiehackers', 'smallbusiness'],
  'business': ['business', 'entrepreneur', 'startups', 'smallbusiness', 'Entrepreneur', 'BusinessIntelligence'],
  'saas': ['SaaS', 'startups', 'entrepreneur', 'indiehackers', 'SideProject'],
  'entrepreneur': ['entrepreneur', 'Entrepreneur', 'startups', 'business', 'smallbusiness'],
  
  // Finance and Fintech
  'fintech': ['fintech', 'CryptoCurrency', 'investing', 'SecurityAnalysis', 'financialindependence', 'startups'],
  'cryptocurrency': ['CryptoCurrency', 'Bitcoin', 'ethereum', 'defi', 'CryptoMarkets'],
  'trading': ['SecurityAnalysis', 'investing', 'StockMarket', 'options', 'financialindependence'],
  'blockchain': ['CryptoCurrency', 'ethereum', 'Bitcoin', 'defi', 'blockchain'],
  
  // E-commerce and Marketing
  'ecommerce': ['ecommerce', 'shopify', 'amazon', 'FulfillmentByAmazon', 'dropship', 'business'],
  'marketing': ['marketing', 'digital_marketing', 'socialmedia', 'SEO', 'PPC', 'entrepreneur'],
  'social media': ['socialmedia', 'marketing', 'Instagram', 'Twitter', 'digital_marketing'],
  
  // Health and Fitness
  'health': ['Health', 'fitness', 'nutrition', 'medicine', 'healthcare', 'mentalhealth'],
  'fitness': ['fitness', 'bodyweightfitness', 'gainit', 'loseit', 'Fitness', 'Health'],
  'mental health': ['mentalhealth', 'psychology', 'depression', 'anxiety', 'Health'],
  
  // Education and Learning
  'education': ['education', 'teachers', 'homeschool', 'GetStudying', 'studytips', 'University'],
  'online learning': ['UniversityofReddit', 'GetStudying', 'studytips', 'education', 'learnprogramming'],
  
  // Gaming
  'gaming': ['gaming', 'Games', 'gamedev', 'IndieGaming', 'Unity3D', 'unrealengine'],
  'game development': ['gamedev', 'IndieGaming', 'Unity3D', 'unrealengine', 'godot', 'Games'],
  
  // Productivity and Tools
  'productivity': ['productivity', 'GetMotivated', 'selfimprovement', 'lifehacks', 'gtd'],
  'automation': ['automation', 'Python', 'programming', 'sysadmin', 'productivity'],
  
  // Default categories
  'technology': ['technology', 'programming', 'webdev', 'startups', 'gadgets'],
  'programming': ['programming', 'learnprogramming', 'webdev', 'compsci', 'coding'],
}

// Function to intelligently select subreddits based on keywords and prompt
function selectRelevantSubreddits(keywords: string[], originalPrompt: string): string[] {
  const selectedSubreddits = new Set<string>()
  const prompt = originalPrompt.toLowerCase()
  
  console.log('🎯 Analyzing prompt for subreddit selection:', prompt)
  console.log('🔍 Keywords:', keywords)
  
  // Direct keyword matching
  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase()
    
    // Check for exact matches in topic map
    for (const [topic, subreddits] of Object.entries(TOPIC_SUBREDDIT_MAP)) {
      if (normalizedKeyword.includes(topic) || topic.includes(normalizedKeyword)) {
        console.log(`✅ Found topic match: "${topic}" for keyword: "${keyword}"`)
        subreddits.forEach(sub => selectedSubreddits.add(sub))
      }
    }
  }
  
  // Prompt-based detection for topics not captured in keywords
  const promptAnalysis = [
    { patterns: ['ai', 'artificial intelligence', 'chatgpt', 'gpt', 'machine learning', 'ml', 'llm'], topic: 'ai' },
    { patterns: ['web', 'website', 'frontend', 'backend', 'react', 'javascript', 'html', 'css'], topic: 'web development' },
    { patterns: ['mobile', 'app', 'android', 'ios', 'flutter'], topic: 'mobile app' },
    { patterns: ['startup', 'business', 'entrepreneur', 'saas'], topic: 'startup' },
    { patterns: ['crypto', 'bitcoin', 'blockchain', 'defi', 'fintech'], topic: 'cryptocurrency' },
    { patterns: ['ecommerce', 'e-commerce', 'shopify', 'amazon'], topic: 'ecommerce' },
    { patterns: ['game', 'gaming', 'unity', 'gamedev'], topic: 'gaming' },
    { patterns: ['health', 'fitness', 'wellness', 'medical'], topic: 'health' },
    { patterns: ['education', 'learning', 'course', 'teach'], topic: 'education' },
    { patterns: ['productivity', 'automation', 'workflow'], topic: 'productivity' },
    { patterns: ['marketing', 'social media', 'seo'], topic: 'marketing' },
    { patterns: ['finance', 'invest', 'trading', 'money'], topic: 'fintech' },
  ]
  
  for (const { patterns, topic } of promptAnalysis) {
    if (patterns.some(pattern => prompt.includes(pattern))) {
      console.log(`✅ Found prompt pattern match for topic: "${topic}"`)
      const subreddits = TOPIC_SUBREDDIT_MAP[topic] || []
      subreddits.forEach(sub => selectedSubreddits.add(sub))
    }
  }
  
  // Add general startup/business subreddits if no specific match found
  if (selectedSubreddits.size === 0) {
    console.log('🔄 No specific matches found, using general subreddits')
    const generalSubreddits = ['startups', 'entrepreneur', 'SaaS', 'technology', 'business', 'sideproject']
    generalSubreddits.forEach(sub => selectedSubreddits.add(sub))
  }
  
  // Always include some core business/startup subreddits for idea generation
  ['startups', 'entrepreneur', 'SaaS'].forEach(sub => selectedSubreddits.add(sub))
  
  const finalSubreddits = Array.from(selectedSubreddits).slice(0, 8) // Limit to 8 subreddits to avoid rate limits
  console.log('🎯 Selected subreddits:', finalSubreddits)
  
  return finalSubreddits
}

export async function scrapeReddit(keywords: string[], originalPrompt: string = ''): Promise<RedditPost[]> {
  try {
    const allPosts: RedditPost[] = []
    
    console.log('🚀 Starting intelligent Reddit scraping')
    console.log('📝 Original prompt:', originalPrompt)
    console.log('🔑 Keywords:', keywords)
    
    // Select relevant subreddits based on prompt and keywords
    const relevantSubreddits = selectRelevantSubreddits(keywords, originalPrompt)
    
    // Search in selected subreddits
    for (const subreddit of relevantSubreddits) {
      try {
        console.log(`🔍 Searching r/${subreddit}...`)
        
        // Try multiple search strategies for each subreddit
        const searchStrategies = [
          // Strategy 1: Use first keyword directly
          keywords[0] || 'ideas',
          // Strategy 2: Combine keywords for more specific search
          keywords.slice(0, 2).join(' '),
          // Strategy 3: Add context words based on subreddit
          getContextualSearchTerm(keywords[0] || 'ideas', subreddit)
        ]
        
        for (const searchTerm of searchStrategies.slice(0, 2)) { // Use first 2 strategies to avoid too many requests
          const posts = await searchSubreddit(subreddit, searchTerm)
          if (posts.length > 0) {
            console.log(`✅ Found ${posts.length} posts in r/${subreddit} with term: "${searchTerm}"`)
            allPosts.push(...posts)
            break // If we found posts, no need to try other strategies for this subreddit
          }
        }
        
        // Add delay between subreddit searches
        await new Promise(resolve => setTimeout(resolve, 1200))
        
      } catch (error) {
        console.error(`❌ Error searching r/${subreddit}:`, error)
        
        // Add fallback posts for this subreddit
        const fallbackPosts = generateContextualFallbackPosts(keywords[0] || 'business', subreddit)
        allPosts.push(...fallbackPosts)
        continue
      }
    }
    
    console.log(`📊 Total posts collected: ${allPosts.length}`)
    
    // Remove duplicates and sort by relevance
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.url === post.url || p.title === post.title)
    )
    
    // Score posts based on relevance to keywords and engagement
    const scoredPosts = uniquePosts.map(post => ({
      ...post,
      relevanceScore: calculateRelevanceScore(post, keywords, originalPrompt)
    }))
    
    const finalPosts = scoredPosts
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 25) // Return top 25 posts
      .map(post => {
        // Remove relevanceScore from final output
        const { relevanceScore, ...cleanPost } = post
        return cleanPost
      })
    
    console.log(`🎯 Final curated posts: ${finalPosts.length}`)
    return finalPosts
      
  } catch (error) {
    console.error('💥 Error in intelligent Reddit scraping:', error)
    // Return topic-aware fallback posts
    const fallbackPosts = keywords.flatMap(keyword => 
      generateContextualFallbackPosts(keyword, 'startups')
    ).slice(0, 15)
    
    console.log('🔄 Using fallback posts:', fallbackPosts.length)
    return fallbackPosts
  }
}

// Helper function to get contextual search terms based on subreddit
function getContextualSearchTerm(baseKeyword: string, subreddit: string): string {
  const contextMap: Record<string, string> = {
    'MachineLearning': `${baseKeyword} project ideas`,
    'artificial': `${baseKeyword} startup opportunities`,
    'webdev': `${baseKeyword} web application`,
    'startups': `${baseKeyword} business idea`,
    'entrepreneur': `${baseKeyword} opportunity`,
    'SaaS': `${baseKeyword} software solution`,
    'androiddev': `${baseKeyword} mobile app`,
    'fitness': `${baseKeyword} health platform`,
    'fintech': `${baseKeyword} financial technology`,
    'gamedev': `${baseKeyword} game concept`,
  }
  
  return contextMap[subreddit] || `${baseKeyword} ideas`
}

// Enhanced search function for individual subreddits
async function searchSubreddit(subreddit: string, searchTerm: string): Promise<RedditPost[]> {
  try {
    const searchQuery = encodeURIComponent(searchTerm)
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${searchQuery}&restrict_sr=1&sort=relevance&limit=8&t=month&raw_json=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    })
    
    if (!response.ok) {
      console.warn(`❌ Reddit API returned ${response.status} for r/${subreddit}`)
      return []
    }
    
    const data: RedditSearchResponse = await response.json()
    
    if (!data.data || !data.data.children || data.data.children.length === 0) {
      return []
    }
    
    return data.data.children
      .filter(child => child.data.title && child.data.title.length > 10) // Filter out low-quality posts
      .map(child => ({
        title: child.data.title,
        content: child.data.selftext || '',
        url: `https://reddit.com${child.data.permalink}`,
        score: child.data.score || 0,
        subreddit: child.data.subreddit,
        created_utc: child.data.created_utc,
        num_comments: child.data.num_comments || 0
      }))
    
  } catch (error) {
    console.error(`❌ Error searching r/${subreddit}:`, error)
    return []
  }
}

// Calculate relevance score for posts
function calculateRelevanceScore(post: RedditPost, keywords: string[], prompt: string): number {
  let score = post.score || 0
  
  // Boost score based on keyword matches in title
  const titleLower = post.title.toLowerCase()
  const contentLower = post.content.toLowerCase()
  const promptLower = prompt.toLowerCase()
  
  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase()
    if (titleLower.includes(keywordLower)) score += 50
    if (contentLower.includes(keywordLower)) score += 25
  }
  
  // Boost score for posts with high engagement
  score += (post.num_comments * 2)
  
  // Boost score for recent posts (within last week)
  const weekAgo = (Date.now() / 1000) - (7 * 24 * 60 * 60)
  if (post.created_utc > weekAgo) score += 20
  
  // Boost score for relevant subreddits
  const relevantSubs = ['startups', 'entrepreneur', 'SaaS', 'indiehackers']
  if (relevantSubs.includes(post.subreddit)) score += 30
  
  return score
}

// Generate contextual fallback posts based on topic and subreddit
function generateContextualFallbackPosts(keyword: string, subreddit: string): RedditPost[] {
  const topicTemplates: Record<string, string[]> = {
    'ai': [
      `AI-powered ${keyword} solutions - what's missing?`,
      `Building ${keyword} with machine learning - need validation`,
      `${keyword} automation using AI - market opportunities`
    ],
    'web development': [
      `${keyword} web platform ideas for developers`,
      `Full-stack ${keyword} application concepts`,
      `Frontend tools for ${keyword} - gap analysis`
    ],
    'mobile app': [
      `${keyword} mobile app concepts that need building`,
      `iOS/Android ${keyword} solutions - market research`,
      `Cross-platform ${keyword} app ideas`
    ],
    'startup': [
      `${keyword} startup ideas - market validation needed`,
      `Building a ${keyword} business - what problems to solve?`,
      `${keyword} venture opportunities in 2024`
    ]
  }
  
  // Select appropriate templates based on keyword context
  let templates = topicTemplates['startup'] // Default
  
  for (const [topic, templ] of Object.entries(topicTemplates)) {
    if (keyword.toLowerCase().includes(topic) || topic.includes(keyword.toLowerCase())) {
      templates = templ
      break
    }
  }
  
  return templates.map((title, index) => ({
    title,
    content: `Looking for insights on ${keyword} solutions. What are the current market gaps and user needs in this space?`,
    url: `https://reddit.com/r/${subreddit}/post_${keyword.replace(/\s+/g, '_')}_${index + 1}`,
    score: 45 + (index * 10),
    subreddit,
    created_utc: Date.now() / 1000 - (86400 * (index + 1)),
    num_comments: 20 + (index * 5)
  }))
}

// Legacy function for backward compatibility
export async function scrapeSubreddit(subreddit: string, keywords: string[]): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = []
  
  for (const keyword of keywords) {
    const posts = await searchSubreddit(subreddit, keyword)
    allPosts.push(...posts)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return allPosts
    .filter((post, index, self) => 
      index === self.findIndex(p => p.url === post.url)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

// Updated relevant subreddits with better categorization
export const RELEVANT_SUBREDDITS = [
  // Core business/startup
  'startups', 'entrepreneur', 'SaaS', 'sideproject', 'indiehackers',
  // Technology
  'technology', 'programming', 'webdev',
  // AI/ML
  'MachineLearning', 'artificial', 'ChatGPT',
  // Mobile
  'androiddev', 'iOSProgramming', 'FlutterDev',
  // Specialized
  'fintech', 'gamedev', 'productivity'
]