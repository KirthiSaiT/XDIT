# xxit - SaaS Idea Generator

A Next.js web application that generates innovative SaaS project ideas using AI and real-time data scraping from Reddit and X (Twitter).

## 🚀 Features

- **AI-Powered Keyword Extraction**: Uses Perplexity Sonar Pro to extract relevant keywords from user prompts
- **Intelligent Idea Generation**: Combines AI analysis with comprehensive web searches to generate unique SaaS ideas
- **User Authentication**: Secure sign-in/sign-up with Clerk
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Detailed Project Analysis**: Includes tech stack suggestions, difficulty assessment, and time estimates

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk
- **AI**: Perplexity Sonar Pro

- **Icons**: Lucide React
- **Fonts**: Geist Sans/Mono

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Perplexity Sonar API key
- Clerk account for authentication


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
   # Perplexity Sonar API Configuration (Required)
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   
   # Clerk Authentication (Required)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   
   ```

4. **Get your API keys**

   - **Perplexity Sonar API**: Go to [Perplexity AI](https://www.perplexity.ai/) and create an API key
   - **Clerk**: Sign up at [Clerk](https://clerk.com/) and create a new application
   

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
│       │   ├── perplexity.ts            # Perplexity Sonar integration

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
        "estimatedTime": "3-6 months"
      }
    ]
  }
}
```

## 🎯 How It Works

1. **User Input**: User enters a concept (e.g., "healthcare automation")
2. **Keyword Extraction**: Perplexity Sonar Pro extracts relevant keywords
3. **AI Analysis**: Perplexity Sonar Pro analyzes data from comprehensive web searches to identify market needs
4. **Idea Generation**: Combines insights to generate structured project ideas

## 🔒 Authentication

The app uses Clerk for authentication with:
- Sign-in/Sign-up modals
- Protected routes
- User session management
- Customizable user profiles

## 🌐 Data Sources

- **Perplexity Sonar Pro**: AI analysis and keyword extraction

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
- [Perplexity AI](https://www.perplexity.ai/)
- [Clerk Authentication](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

**Common Issues:**

1. **API Key Errors**: Ensure all required environment variables are set in `.env.local`

3. **CORS Issues**: The app uses server-side API routes to avoid CORS problems
4. **Build Errors**: Run `npm install` to ensure all dependencies are installed

For more help, check the console logs or open an issue on GitHub.
