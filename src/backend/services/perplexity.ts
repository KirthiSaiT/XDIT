import axios from 'axios';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY?.trim();
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Debug logging
console.log('Perplexity API Key Status:', {
  hasKey: !!PERPLEXITY_API_KEY,
  keyLength: PERPLEXITY_API_KEY?.length || 0,
  keyPrefix: PERPLEXITY_API_KEY?.substring(0, 8) + '...' || 'none'
});

if (!PERPLEXITY_API_KEY) {
  throw new Error(
    'Missing PERPLEXITY_API_KEY environment variable. Please obtain your API key from your Perplexity AI settings and set it before running the app.'
  );
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityChatResponse {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    message: PerplexityMessage;
    finish_reason: string;
  }>;
  search_results?: Array<any>;
}

export class PerplexityService {
  static async testConnection(): Promise<boolean> {
    try {
      const response = await axios.post(
        PERPLEXITY_API_URL,
        {
          model: 'sonar-small-online',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          },
        }
      );
      return response.status === 200;
    } catch (error: any) {
      console.error('API connection test failed:', error.response?.status, error.response?.data);
      return false;
    }
  }

  static async chat(
    messages: PerplexityMessage[],
    model: string = 'sonar-small-online'
  ): Promise<PerplexityChatResponse> {
    try {
      console.log('Making request to Perplexity AI with model:', model);
      console.log('API Key being used:', PERPLEXITY_API_KEY?.substring(0, 8) + '...');
      
      const response = await axios.post<PerplexityChatResponse>(
        PERPLEXITY_API_URL,
        {
          model,
          messages,
          max_tokens: 2000,
          temperature: 0.7,
          search_recall: 1,
          include_search_results: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          },
        }
      );
      
      console.log('Perplexity API Response:', {
        status: response.status,
        hasChoices: !!response.data.choices,
        choiceCount: response.data.choices?.length || 0,
        hasSearchResults: !!response.data.search_results,
        searchResultCount: response.data.search_results?.length || 0
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('401 Unauthorized: Check your API key. Raw error response:', error.response?.data);
        console.error('Request headers sent:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY?.substring(0, 8)}...`
        });
        throw new Error('Authentication failed. Please ensure your PERPLEXITY_API_KEY is correct and active. You can find it in your Perplexity AI account settings.');
      } else if (error.response) {
        console.error('Error communicating with Perplexity AI. Status:', error.response.status, 'Data:', error.response.data);
        throw new Error(`Perplexity AI API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received from Perplexity AI. Request details:', error.request);
        throw new Error('No response received from Perplexity AI. Please check your network connection or the API service status.');
      } else {
        console.error('Error setting up request to Perplexity AI:', error.message);
        throw new Error(`Error setting up request to Perplexity AI: ${error.message}`);
      }
    }
  }

  // Extract keywords from user prompt
  static async extractKeywords(prompt: string): Promise<string[]> {
    try {
      const messages: PerplexityMessage[] = [
        {
          role: 'system',
          content: 'You are a keyword extraction expert. Extract 5-8 relevant keywords from the user prompt that would be useful for market research and idea generation. Return only the keywords as a JSON array of strings.'
        },
        {
          role: 'user',
          content: `Extract keywords from: "${prompt}"`
        }
      ];

      const response = await this.chat(messages, 'sonar-small-online');
      const content = response.choices[0].message.content;
      
      try {
        // Try to parse JSON response
        const keywords = JSON.parse(content);
        if (Array.isArray(keywords)) {
          return keywords.filter(k => typeof k === 'string' && k.trim().length > 0);
        }
      } catch (parseError) {
        console.warn('Could not parse keywords as JSON, using fallback extraction');
      }
      
      // Fallback: extract keywords manually
      const words = prompt.toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['give', 'me', 'some', 'ideas', 'about', 'with', 'that', 'this', 'have', 'will', 'would', 'could', 'should'].includes(word));
      
      return [...new Set(words)].slice(0, 8);
    } catch (error) {
      console.error('Error extracting keywords:', error);
      // Fallback to basic keyword extraction
      return prompt.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5);
    }
  }
<<<<<<< HEAD
=======
  
  // Combine extracted concepts with meaningful phrases
  const allKeywords = [...extractedConcepts, ...phrases]
  
  // If we found meaningful keywords, return them; otherwise use single important words
  if (allKeywords.length > 0) {
    return allKeywords.slice(0, 3) // Return top 3 most relevant phrases
  }
  
  // Fallback to individual important words
  const importantWords = words.filter(word => 
    word.length > 3 && 
    !stopWords.has(word) &&
    /^[a-z]+$/.test(word)
  )
  
  return importantWords.slice(0, 3)
}

export async function extractKeywords(prompt: string): Promise<string[]> {
  try {
    console.log('🔍 Attempting enhanced keyword extraction with Perplexity Sonar...');

    return await retryWithBackoff(async () => {
      const perplexityPrompt = `You are a keyword extraction expert. Your task is to understand what the user is really asking for and extract the CORE TOPIC and DOMAIN they're interested in, NOT the request words.

IGNORE these request words: "give me", "ideas", "some", "few", "what are", "how to", "can you"
FOCUS on the actual SUBJECT MATTER and DOMAIN.

Examples:
- "Give me a few ideas on building a successful startup" → Keywords: "building successful startup", "startup success strategies"
- "What are some project ideas for a beginner in web development?" → Keywords: "beginner web development projects", "web development for beginners"
- "Generate some business ideas using AI and machine learning" → Keywords: "AI business applications", "machine learning business opportunities"
- "How to create a mobile app for fitness tracking?" → Keywords: "fitness tracking mobile app", "health and wellness apps"
- "SaaS ideas for small businesses" → Keywords: "small business SaaS solutions", "business automation tools"

User prompt: "${prompt}"

Extract 2-3 keyword phrases that represent the CORE DOMAIN and TOPIC the user wants to explore. Focus on:
1. The main subject/industry
2. The specific area or niche
3. The target audience (if mentioned)

Return ONLY the keyword phrases, one per line, without numbers or bullets:`;

      const data = await makePerplexityRequest(perplexityPrompt);
      const text = data.choices[0].message.content.trim();

      // Parse keywords from the response
      const keywords = text
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && !line.match(/^\d+\.|-|•/)) // Remove numbered/bulleted items
        .slice(0, 3); // Take top 3

      if (keywords.length === 0) {
        throw new Error('No keywords extracted from AI response');
      }

      console.log('✅ AI keyword extraction successful:', keywords);
      return keywords;
    });
  } catch (error: any) {
    console.warn('⚠️ AI keyword extraction failed, using enhanced fallback method:', error.message);

    // Use enhanced fallback method
    const fallbackKeywords = extractKeywordsFromText(prompt);
    console.log('🔄 Enhanced fallback keywords extracted:', fallbackKeywords);

    return fallbackKeywords.length > 0 ? fallbackKeywords : ['business opportunities', 'market solutions'];
  }
}

export async function analyzeScrapedData(
  prompt: string,
  keywords: string[]
): Promise<Array<{ idea: string; sources: string[] }>> {
  try {
    console.log('🤖 Attempting AI analysis with Perplexity Sonar (Deep Research)...');

    return await retryWithBackoff(async () => {
      const analysisPrompt = `You are a business idea generator. Based on the user's request and by performing a comprehensive deep web search across platforms like LinkedIn, Reddit, X (Twitter), and public forums, generate 5 specific, actionable SaaS/business ideas.

For each idea, provide a brief description and include 2-3 relevant source URLs that support the market need or concept. If no direct source is found, provide a relevant general industry trend link.

User Request: "${prompt}"
Focus Areas: ${keywords.join(', ')}

Requirements:
1. Generate exactly 5 business/SaaS ideas.
2. Each idea should be specific and actionable.
3. Address real problems identified through your deep web search.
4. Be relevant to the focus areas: ${keywords.join(', ')}.
5. Include a brief description of the solution.
6. For each idea, provide 2-3 relevant source URLs on separate lines after the description. If no direct source, provide a general industry trend link.

Format each idea as:
Idea Name: Brief description of what it does and the problem it solves
Source: [URL1]
Source: [URL2]
Source: [URL3]

Ideas:`;

      const data = await makePerplexityRequest(analysisPrompt);
      const text = data.choices[0].message.content.trim();

      const ideasWithSources: Array<{ idea: string; sources: string[] }> = [];
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      let currentIdea: { idea: string; sources: string[] } | null = null;

      for (const line of lines) {
        if (line.startsWith('Idea Name:')) {
          if (currentIdea) {
            ideasWithSources.push(currentIdea);
          }
          currentIdea = { idea: line.replace('Idea Name:', '').trim(), sources: [] };
        } else if (line.startsWith('Source:') && currentIdea) {
          const url = line.replace('Source:', '').trim();
          if (url) {
            currentIdea.sources.push(url);
          }
        } else if (currentIdea) {
          // This is part of the description
          currentIdea.idea += ' ' + line;
        }
      }
      if (currentIdea) {
        ideasWithSources.push(currentIdea);
      }

      if (ideasWithSources.length === 0) {
        throw new Error('No ideas generated from AI response');
      }

      console.log('✅ AI idea generation successful:', ideasWithSources.length, 'ideas');
      return ideasWithSources.slice(0, 5); // Ensure we only return 5 ideas
    });
  } catch (error: any) {
    console.warn('⚠️ AI idea generation failed, using enhanced fallback method:', error.message);

    // Enhanced fallback idea generation
    const fallbackIdeas = generateEnhancedFallbackIdeas(prompt, keywords);
    console.log('🔄 Enhanced fallback ideas generated:', fallbackIdeas.length, 'ideas');

    return fallbackIdeas.map(idea => ({ idea, sources: [] }));
  }
}

// Enhanced fallback idea generation with better context understanding
function generateEnhancedFallbackIdeas(
  prompt: string,
  keywords: string[]
): string[] {
  const primaryKeyword = keywords[0] || 'business solution';
  const secondaryKeyword = keywords[1] || 'automation tool';

  // No scraped content to extract problems from, as we are relying on Perplexity for that
  
  // Generate contextual ideas based on the primary keyword domain
  let templates: string[] = [];

  if (primaryKeyword.includes('startup') || primaryKeyword.includes('business')) {
    templates = [
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Planning Platform: A comprehensive tool that helps entrepreneurs validate ideas, create business plans, and track progress with built-in market research features.`, 
      `${secondaryKeyword.charAt(0).toUpperCase() + secondaryKeyword.slice(1)} Marketplace: Connect ${primaryKeyword} founders with essential services, mentors, and resources needed for ${secondaryKeyword}.`,
      `AI-Powered ${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Assistant: Intelligent platform that provides personalized advice, market insights, and strategic guidance for ${secondaryKeyword}.`,
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Community Hub: Social platform where entrepreneurs can collaborate, share experiences, and get feedback on their ${secondaryKeyword} ideas.`,
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Analytics Dashboard: Track key metrics, market trends, and performance indicators for ${secondaryKeyword} success.`
    ];
  } else if (primaryKeyword.includes('web development') || primaryKeyword.includes('development')) {
    templates = [
      `No-Code Website Builder for ${primaryKeyword}: Drag-and-drop platform specifically designed for ${secondaryKeyword} with industry-specific templates.`, 
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Learning Platform: Interactive coding tutorials and project-based learning for ${secondaryKeyword}.`,
      `Code Review and Collaboration Tool: Platform for ${primaryKeyword} teams to review code, share feedback, and collaborate on ${secondaryKeyword} projects.`,
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Portfolio Generator: Automated tool that creates professional portfolios for ${secondaryKeyword} developers.`,
      `Bug Tracking and Project Management: Specialized tool for ${primaryKeyword} projects with integrated ${secondaryKeyword} workflows.`
    ];
  } else {
    // Generic templates that work for any domain
    templates = [
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Management Platform: Comprehensive solution for organizing and optimizing ${secondaryKeyword} workflows.`,
      `AI-Powered ${primaryKeyword} Assistant: Intelligent tool that automates ${secondaryKeyword} tasks and provides smart recommendations.`,
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Analytics Dashboard: Real-time insights and analytics for ${secondaryKeyword} performance tracking.`,
      `Collaborative ${primaryKeyword} Workspace: Team-based platform for managing ${secondaryKeyword} projects and communication.`,
      `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} Marketplace: Connect service providers with businesses needing ${secondaryKeyword} solutions.`
    ];
  }

  

  return templates;
>>>>>>> 2345b269107e1e40dcccb1446eaa8d06f08654da
}
