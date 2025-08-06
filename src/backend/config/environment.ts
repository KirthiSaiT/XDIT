interface EnvironmentConfig {
  gemini: {
    apiKey: string
  }
  twitter: {
    bearerToken?: string
    apiKey?: string
    apiSecret?: string
  }
  scraping: {
    redditRequestDelay: number
    xRequestDelay: number
    maxRedditPosts: number
    maxXPosts: number
  }
  clerk: {
    publishableKey: string
    secretKey: string
  }
}

function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    gemini: {
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || ''
    },
    twitter: {
      bearerToken: process.env.TWITTER_BEARER_TOKEN,
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET
    },
    scraping: {
      redditRequestDelay: parseInt(process.env.REDDIT_REQUEST_DELAY || '1000'),
      xRequestDelay: parseInt(process.env.X_REQUEST_DELAY || '2000'),
      maxRedditPosts: parseInt(process.env.MAX_REDDIT_POSTS || '20'),
      maxXPosts: parseInt(process.env.MAX_X_POSTS || '15')
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
      secretKey: process.env.CLERK_SECRET_KEY || ''
    }
  }

  // Validate required environment variables
  const missingVars: string[] = []

  if (!config.gemini.apiKey) {
    missingVars.push('GOOGLE_GEMINI_API_KEY')
  }

  if (!config.clerk.publishableKey) {
    missingVars.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
  }

  if (!config.clerk.secretKey) {
    missingVars.push('CLERK_SECRET_KEY')
  }

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`)
    console.warn('Please check your .env.local file')
  }

  return config
}

export const env = validateEnvironment()

export const API_ENDPOINTS = {
  reddit: {
    search: 'https://www.reddit.com/search.json',
    subreddit: (subreddit: string) => `https://www.reddit.com/r/${subreddit}/search.json`
  },
  twitter: {
    search: 'https://api.twitter.com/2/tweets/search/recent'
  }
}

export const USER_AGENTS = {
  reddit: 'xxit-bot/1.0 (SaaS Idea Generator)',
  twitter: 'xxit-bot/1.0 (SaaS Idea Generator)'
}

export const RATE_LIMITS = {
  reddit: {
    requestsPerMinute: 60,
    delayBetweenRequests: env.scraping.redditRequestDelay
  },
  twitter: {
    requestsPerMinute: 300, // Twitter API v2 rate limits
    delayBetweenRequests: env.scraping.xRequestDelay
  }
} 