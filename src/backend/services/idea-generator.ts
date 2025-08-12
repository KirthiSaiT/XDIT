import { analyzeScrapedData } from './perplexity'



interface ProjectIdea {
  idea: string
  description: string
  marketNeed: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
}

export async function generateProjectIdeas(
  prompt: string,
  keywords: string[]
): Promise<ProjectIdea[]> {
  try {
    const aiIdeas = await analyzeScrapedData(prompt, keywords)
    
    return aiIdeas.map(idea => ({
      idea: idea.split(':')[0].trim(),
      description: idea.split(':').slice(1).join(':').trim(),
      marketNeed: 'Identified through AI-powered web search',
      techStack: ['React', 'Node.js', 'TypeScript'], // Default tech stack
      difficulty: 'Medium',
      estimatedTime: '2-3 months'
    }))
    
  } catch (error) {
    console.error('Error generating project ideas:', error)
    
    // Fallback to basic ideas if AI fails
    return generateFallbackIdeas(prompt, keywords)
  }
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