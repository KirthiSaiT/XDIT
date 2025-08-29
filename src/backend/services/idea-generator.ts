import { PerplexityService } from './perplexity'

interface ProjectIdea {
  _id?: string
  idea: string
  description: string
  marketNeed: string
  marketValue: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  sources: Array<{
    title?: string
    url?: string
    snippet?: string
    source?: string
  }>
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
    console.log('Keywords:', keywords);

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

    const ideaGenerationPrompt = `Based on the research about "${prompt}", generate exactly 5 innovative SaaS project ideas.

    For each idea, provide:
    - A clear, concise title
    - A detailed description explaining the concept
    - The specific market need or problem it solves
    - An estimated market value or potential revenue.
    - Recommended technology stack (be specific with frameworks, languages, tools)
    - Difficulty level (Easy: 1-2 months, Medium: 3-6 months, Hard: 6+ months)
    - A brief explanation for the estimated development time.
    - A list of relevant research sources (URLs) that you used to generate this specific idea.
    
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
        "marketValue": "Estimated market value",
        "techStack": ["Technology1", "Technology2"],
        "difficulty": "Easy|Medium|Hard",
        "estimatedTime": "Time estimate with explanation",
        "sources": [
            { "title": "Source Title 1", "url": "https://example.com/source1" },
            { "title": "Source Title 2", "url": "https://example.com/source2" }
        ]
      }
    ]
    
    IMPORTANT: Generate exactly 5 ideas, no more, no less. Each idea must have its own list of sources.`;

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

    let ideas: ProjectIdea[] = [];
    try {
      const content = ideaResponse.choices[0].message.content;
      console.log('Raw AI response:', content.substring(0, 200) + '...');
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonContent = JSON.parse(jsonMatch[0]);
        if (Array.isArray(jsonContent)) {
          ideas = jsonContent.map(item => ({
            _id: `idea-${Date.now()}-${Math.random()}`,
            idea: item.idea || '',
            description: item.description || '',
            marketNeed: item.marketNeed || '',
            marketValue: item.marketValue || '',
            techStack: Array.isArray(item.techStack) ? item.techStack : [],
            difficulty: item.difficulty || 'Medium',
            estimatedTime: item.estimatedTime || '',
            sources: Array.isArray(item.sources) ? item.sources : (researchResponse.search_results || [])
          }));
        }
      }
      
      if (ideas.length === 0) {
        console.warn('No valid JSON found in response, creating fallback idea');
        ideas.push({
          _id: `idea-${Date.now()}-${Math.random()}`,
          idea: `AI-Powered ${prompt} Solution`,
          description: content || `An innovative solution for ${prompt} leveraging AI and modern technology.`,
          marketNeed: `Addresses the growing need for ${prompt} solutions in the market.`,
          marketValue: 'Not estimated.',
          techStack: ['React', 'Node.js', 'Python', 'AI/ML'],
          difficulty: 'Medium',
          estimatedTime: '3-6 months',
          sources: researchResponse.search_results || []
        });
      }
      
    } catch (parseError) {
      console.warn('Could not parse AI response as JSON, creating fallback idea:', parseError);
      ideas.push({
        _id: `idea-${Date.now()}-${Math.random()}`,
        idea: `Smart ${prompt} Platform`,
        description: `A comprehensive platform that addresses ${prompt} challenges using cutting-edge technology.`,
        marketNeed: `Solves critical problems in the ${prompt} industry.`,
        marketValue: 'Not estimated.',
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