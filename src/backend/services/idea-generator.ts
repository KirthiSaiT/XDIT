import { PerplexityService } from './perplexity'

interface ProjectIdea {
  idea: string
  description: string
  marketNeed: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  sources: any[]
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateProjectIdeas(
  prompt: string,
  keywords: string[]
): Promise<ProjectIdea[]> {
  try {
    console.log('Starting idea generation for prompt:', prompt);
    console.log('Starting idea generation for prompt:', prompt);
    console.log('Keywords:', keywords);
    
    // First, let's research the topic to understand current market trends
    const researchPrompt = `Research the following topic: "${prompt}". 
    
    Please provide:
    1. Current market trends and opportunities
    2. Existing solutions and their limitations
    3. Potential gaps in the market
    4. Recent developments in this field
    
    Focus on finding real, actionable insights that could lead to viable business opportunities.`;

    const researchMessages: PerplexityMessage[] = [
      { 
        role: 'system', 
        content: 'You are a market research expert specializing in identifying business opportunities and market gaps. Provide comprehensive, well-researched insights with specific examples and sources.' 
      },
      { 
        role: 'user', 
        content: researchPrompt 
      }
    ];

    console.log('Calling Perplexity service for research...');
    const researchResponse = await PerplexityService.chat(researchMessages, 'sonar');
    
    console.log('Research completed. Search results found:', researchResponse.search_results?.length || 0);
    
    // Now generate project ideas based on the research
    const ideaGenerationPrompt = `Based on the research about "${prompt}", generate 3 innovative SaaS project ideas.

    For each idea, provide:
    - A clear, concise title
    - A detailed description explaining the concept
    - The specific market need or problem it solves
    - Recommended technology stack (be specific with frameworks, languages, tools)
    - Difficulty level (Easy: 1-2 months, Medium: 3-6 months, Hard: 6+ months)
    - Estimated development time
    
    Make sure each idea is:
    - Feasible with current technology
    - Addresses a real market need
    - Has clear monetization potential
    - Is specific enough to be actionable
    
    Format your response as a JSON array with these exact keys:
    [
      {
        "idea": "Project Title",
        "description": "Detailed description",
        "marketNeed": "Specific problem it solves",
        "techStack": ["Technology1", "Technology2"],
        "difficulty": "Easy|Medium|Hard",
        "estimatedTime": "Time estimate"
      }
    ]`;

    const ideaMessages: PerplexityMessage[] = [
      { 
        role: 'system', 
        content: 'You are a product strategist and technical architect. Generate innovative, viable SaaS project ideas based on market research. Always respond with valid JSON.' 
      },
      { 
        role: 'user', 
        content: ideaGenerationPrompt 
      }
    ];

    console.log('Generating project ideas...');
    const ideaResponse = await PerplexityService.chat(ideaMessages, 'sonar');
    
    console.log('Ideas generated. Processing response...');

    // Process the generated ideas
    let ideas: ProjectIdea[] = [];
    try {
      const content = ideaResponse.choices[0].message.content;
      console.log('Raw AI response:', content.substring(0, 200) + '...');
      
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonContent = JSON.parse(jsonMatch[0]);
        if (Array.isArray(jsonContent)) {
          ideas = jsonContent.map(item => ({
            idea: item.idea || item.Idea || '',
            description: item.description || item.Description || '',
            marketNeed: item.marketNeed || item['Market Need'] || item.market_need || '',
            techStack: Array.isArray(item.techStack || item['Tech Stack'] || item.tech_stack) 
              ? (item.techStack || item['Tech Stack'] || item.tech_stack) 
              : [],
            difficulty: item.difficulty || item.Difficulty || 'Medium',
            estimatedTime: item.estimatedTime || item['Estimated Time'] || item.estimated_time || '',
            sources: researchResponse.search_results || []
          }));
        }
      }
      
      // If no valid JSON found, create a fallback idea
      if (ideas.length === 0) {
        console.warn('No valid JSON found in response, creating fallback idea');
        ideas.push({
          idea: `AI-Powered ${prompt} Solution`,
          description: content || `An innovative solution for ${prompt} leveraging AI and modern technology.`,
          marketNeed: `Addresses the growing need for ${prompt} solutions in the market.`,
          techStack: ['React', 'Node.js', 'Python', 'AI/ML'],
          difficulty: 'Medium',
          estimatedTime: '3-6 months',
          sources: researchResponse.search_results || []
        });
      }
      
    } catch (parseError) {
      console.warn('Could not parse AI response as JSON, creating fallback idea:', parseError);
      ideas.push({
        idea: `Smart ${prompt} Platform`,
        description: `A comprehensive platform that addresses ${prompt} challenges using cutting-edge technology.`,
        marketNeed: `Solves critical problems in the ${prompt} industry.`,
        techStack: ['React', 'Node.js', 'TypeScript', 'AI/ML'],
        difficulty: 'Medium',
        estimatedTime: '4-8 months',
        sources: researchResponse.search_results || []
      });
    }

    console.log(`Successfully generated ${ideas.length} project ideas`);
    return ideas;
    
  } catch (error) {
    console.error('Error generating project ideas:', error);
    throw error;
  }
} 