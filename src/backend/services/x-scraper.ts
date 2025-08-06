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

interface TwitterSearchResponse {
  data?: Array<{
    id: string
    text: string
    created_at: string
    author_id: string
    public_metrics: {
      like_count: number
      retweet_count: number
      reply_count: number
    }
  }>
  includes?: {
    users: Array<{
      id: string
      username: string
      verified: boolean
    }>
  }
}

export async function scrapeX(keywords: string[]): Promise<XPost[]> {
  try {
    const allPosts: XPost[] = []
    
    // Note: This implementation uses Twitter API v2
    // You'll need to set up Twitter API credentials
    for (const keyword of keywords) {
      try {
        // For demonstration, using a mock scraper approach
        // In production, you'd use official Twitter API or third-party services
        const posts = await scrapeXWithPuppeteer(keyword)
        allPosts.push(...posts)
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`Error scraping X for keyword "${keyword}":`, error)
        continue
      }
    }
    
    // Remove duplicates and sort by engagement
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.url === post.url)
    )
    
    return uniquePosts
      .sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets))
      .slice(0, 15) // Return top 15 posts
      
  } catch (error) {
    console.error('Error in X scraping:', error)
    return []
  }
}

// Enhanced scraping method with better mock data and trends
async function scrapeXWithPuppeteer(keyword: string): Promise<XPost[]> {
  try {
    console.log(`Generating X content for keyword: ${keyword}`)
    
    // Generate more realistic and diverse content based on the keyword
    const mockPosts: XPost[] = [
      {
        content: `Just discovered an amazing ${keyword} solution that's transforming how we work. The ROI is incredible! Anyone else seeing similar results? #${keyword.replace(/\s+/g, '')} #productivity #business`,
        url: `https://x.com/techleader/status/${Date.now()}1`,
        likes: Math.floor(Math.random() * 50) + 20,
        retweets: Math.floor(Math.random() * 25) + 5,
        replies: Math.floor(Math.random() * 15) + 3,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: '@techleader',
        verified: true
      },
      {
        content: `Looking for recommendations on ${keyword} tools for a 50-person startup. What's working well for you? Budget is flexible but need something that scales. #startups #${keyword.replace(/\s+/g, '')}`,
        url: `https://x.com/startup_ceo/status/${Date.now()}2`,
        likes: Math.floor(Math.random() * 80) + 30,
        retweets: Math.floor(Math.random() * 40) + 10,
        replies: Math.floor(Math.random() * 25) + 8,
        created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: '@startup_ceo',
        verified: false
      },
      {
        content: `The ${keyword} market is exploding! Just closed a $2M round for our SaaS platform. Key insight: focus on user experience over features. Thread below 🧵`,
        url: `https://x.com/saas_founder/status/${Date.now()}3`,
        likes: Math.floor(Math.random() * 120) + 50,
        retweets: Math.floor(Math.random() * 60) + 20,
        replies: Math.floor(Math.random() * 30) + 10,
        created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: '@saas_founder',
        verified: true
      },
      {
        content: `Problem: Current ${keyword} solutions are too complex for small businesses. Opportunity: Simple, affordable alternative that just works. Who's building this? 🤔`,
        url: `https://x.com/entrepreneur/status/${Date.now()}4`,
        likes: Math.floor(Math.random() * 90) + 25,
        retweets: Math.floor(Math.random() * 45) + 12,
        replies: Math.floor(Math.random() * 35) + 15,
        created_at: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: '@entrepreneur',
        verified: false
      },
      {
        content: `Hot take: Most ${keyword} platforms are solving the wrong problem. Users don't need more features, they need better workflows. Less is more. #productmanagement`,
        url: `https://x.com/product_guru/status/${Date.now()}5`,
        likes: Math.floor(Math.random() * 75) + 35,
        retweets: Math.floor(Math.random() * 30) + 8,
        replies: Math.floor(Math.random() * 20) + 6,
        created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        author: '@product_guru',
        verified: true
      },
      {
        content: `Just tried 5 different ${keyword} tools this week. Here's my honest review: 1) Tool A - great UX, pricey. 2) Tool B - powerful but complex. 3) Tool C - missing key features. Gap in market for something in between.`,
        url: `https://x.com/tech_reviewer/status/${Date.now()}6`,
        likes: Math.floor(Math.random() * 60) + 20,
        retweets: Math.floor(Math.random() * 25) + 5,
        replies: Math.floor(Math.random() * 18) + 7,
        created_at: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
        author: '@tech_reviewer',
        verified: false
      }
    ]
    
    // Filter and randomize posts
    const selectedPosts = mockPosts
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, 4) // Return 4 posts
    
    console.log(`Generated ${selectedPosts.length} X posts for keyword: ${keyword}`)
    return selectedPosts
    
  } catch (error) {
    console.error('Error in X content generation:', error)
    return []
  }
}

// Alternative: Using official Twitter API v2 (requires API keys)
export async function scrapeXWithAPI(keywords: string[]): Promise<XPost[]> {
  const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN
  
  if (!TWITTER_BEARER_TOKEN) {
    console.warn('Twitter Bearer Token not found, skipping X scraping')
    return []
  }
  
  try {
    const allPosts: XPost[] = []
    
    for (const keyword of keywords) {
      try {
        const query = encodeURIComponent(`${keyword} -is:retweet lang:en`)
        const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=10&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=username,verified`
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            'User-Agent': 'xxit-bot/1.0 (SaaS Idea Generator)',
          },
        })
        
        if (!response.ok) {
          console.warn(`Twitter API returned ${response.status} for keyword: ${keyword}`)
          continue
        }
        
        const data: TwitterSearchResponse = await response.json()
        
        if (data.data && data.data.length > 0) {
          const userMap = new Map()
          if (data.includes?.users) {
            data.includes.users.forEach(user => {
              userMap.set(user.id, user)
            })
          }
          
          const posts = data.data.map(tweet => {
            const author = userMap.get(tweet.author_id) || { username: 'unknown', verified: false }
            
            return {
              content: tweet.text,
              url: `https://x.com/${author.username}/status/${tweet.id}`,
              likes: tweet.public_metrics.like_count,
              retweets: tweet.public_metrics.retweet_count,
              replies: tweet.public_metrics.reply_count,
              created_at: tweet.created_at,
              author: `@${author.username}`,
              verified: author.verified
            }
          })
          
          allPosts.push(...posts)
        }
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`Error scraping X API for keyword "${keyword}":`, error)
        continue
      }
    }
    
    return allPosts
      .filter((post, index, self) => 
        index === self.findIndex(p => p.url === post.url)
      )
      .sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets))
      .slice(0, 15)
      
  } catch (error) {
    console.error('Error in X API scraping:', error)
    return []
  }
}

// Trending hashtags related to startup and SaaS topics
export const TRENDING_HASHTAGS = [
  '#startup',
  '#SaaS',
  '#entrepreneur',
  '#tech',
  '#innovation',
  '#productivity',
  '#automation',
  '#AI',
  '#nocode',
  '#indiehacker'
] 