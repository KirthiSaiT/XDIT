# xxit - SaaS Idea Generator

A Next.js web application that generates innovative SaaS project ideas using AI and real-time data scraping from Reddit and X (Twitter).

## 🚀 Features

- **AI-Powered Keyword Extraction**: Uses Google Gemini API to extract relevant keywords from user prompts
- **Real-time Data Scraping**: Scrapes Reddit and X for market insights and trending discussions
- **Intelligent Idea Generation**: Combines AI analysis with scraped data to generate unique SaaS ideas
- **User Authentication**: Secure sign-in/sign-up with Clerk
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Detailed Project Analysis**: Includes tech stack suggestions, difficulty assessment, and time estimates

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk
- **AI**: Google Gemini API
- **Data Scraping**: Custom Reddit API integration, Twitter API v2
- **Icons**: Lucide React
- **Fonts**: Geist Sans/Mono

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key
- Clerk account for authentication
- (Optional) Twitter API v2 Bearer Token for enhanced X scraping

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd xxit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini API Configuration (Required)
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
   
   # Clerk Authentication (Required)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Twitter API Configuration (Optional - for enhanced X scraping)
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   TWITTER_API_KEY=your_twitter_api_key_here
   TWITTER_API_SECRET=your_twitter_api_secret_here
   
   # Scraping Configuration (Optional)
   REDDIT_REQUEST_DELAY=1000
   X_REQUEST_DELAY=2000
   MAX_REDDIT_POSTS=20
   MAX_X_POSTS=15
   ```

4. **Get your API keys**

   - **Google Gemini API**: Go to [Google AI Studio](https://ai.google.dev/) and create an API key
   - **Clerk**: Sign up at [Clerk](https://clerk.com/) and create a new application
   - **Twitter API** (Optional): Apply for access at [Twitter Developer Portal](https://developer.twitter.com/)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
xxit/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-ideas/
│   │   │       └── route.ts          # Main API endpoint
│   │   ├── page.tsx                  # Main UI component
│   │   ├── layout.tsx                # Root layout with Clerk
│   │   └── globals.css               # Global styles
│   └── backend/
│       ├── services/
│       │   ├── gemini.ts            # Google Gemini integration
│       │   ├── reddit-scraper.ts    # Reddit data scraping
│       │   ├── x-scraper.ts         # X (Twitter) data scraping
│       │   └── idea-generator.ts    # Project idea generation logic
│       └── config/
│           └── environment.ts        # Environment configuration
├── public/                          # Static assets
├── package.json                     # Dependencies
└── README.md                       # This file
```

## 🔧 API Endpoints

### POST `/api/generate-ideas`

Generates SaaS project ideas based on user input.

**Request Body:**
```json
{
  "prompt": "AI-powered healthcare automation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keywords": ["AI", "healthcare", "automation"],
    "projectIdeas": [
      {
        "idea": "Build an AI-powered patient triage system",
        "description": "A comprehensive platform that leverages AI, healthcare, automation...",
        "marketNeed": "Addresses common challenges including: long wait times, staffing shortages",
        "techStack": ["React", "Node.js", "TypeScript", "Python", "TensorFlow"],
        "difficulty": "Hard",
        "estimatedTime": "3-6 months",
        "sources": ["https://reddit.com/r/healthcare/post123", "https://x.com/user/status456"]
      }
    ],
    "sources": {
      "reddit": 15,
      "x": 8
    }
  }
}
```

## 🎯 How It Works

1. **User Input**: User enters a concept (e.g., "healthcare automation")
2. **Keyword Extraction**: Google Gemini API extracts relevant keywords
3. **Data Scraping**: 
   - Reddit: Searches relevant subreddits for discussions
   - X: Searches for tweets and trends (with API or fallback method)
4. **AI Analysis**: Gemini analyzes scraped data to identify market needs
5. **Idea Generation**: Combines insights to generate structured project ideas
6. **Enhancement**: Adds tech stack suggestions, difficulty assessment, and time estimates

## 🔒 Authentication

The app uses Clerk for authentication with:
- Sign-in/Sign-up modals
- Protected routes
- User session management
- Customizable user profiles

## 🌐 Data Sources

- **Reddit**: Public JSON API for posts and discussions
- **X (Twitter)**: API v2 for tweets and trends (with fallback options)
- **Google Gemini**: AI analysis and keyword extraction

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended)
   ```bash
   npx vercel
   ```

3. **Set environment variables** in your deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini AI](https://ai.google.dev/)
- [Clerk Authentication](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

**Common Issues:**

1. **API Key Errors**: Ensure all required environment variables are set in `.env.local`
2. **Rate Limiting**: Reddit and X have rate limits - the app includes delays to handle this
3. **CORS Issues**: The app uses server-side API routes to avoid CORS problems
4. **Build Errors**: Run `npm install` to ensure all dependencies are installed

For more help, check the console logs or open an issue on GitHub.
