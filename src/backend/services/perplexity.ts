import { env } from '../config/environment';

if (!env.perplexity.apiKey) {
  throw new Error('PERPLEXITY_API_KEY environment variable is required');
}

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;

      if (error.message?.includes('429') || error.message?.includes('quota')) {
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
        console.log(`⏳ Rate limited, retrying in ${Math.round(delay)}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry non-quota errors
      }
    }
  }
  throw new Error('Max retries exceeded');
}

async function makePerplexityRequest(prompt: string): Promise<any> {
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.perplexity.apiKey}`
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Perplexity API request failed with status ${response.status}: ${errorBody}`);
  }

  return response.json();
}

// Enhanced fallback keyword extraction with better context understanding
function extractKeywordsFromText(prompt: string): string[] {
    // Remove generic request words but keep domain-specific terms
  const stopWords = new Set([
    'give', 'me', 'some', 'few', 'ideas', 'on', 'how', 'to', 'what', 'are',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'at', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'can', 'about', 'get', 'make'
  ])
  
  // Extract meaningful phrases and keywords
  const text = prompt.toLowerCase()
  
  // Look for key patterns that indicate the domain/topic
  const domainPatterns = [
    /project ideas?.*?([a-z\s]+)/,
    /building.*?([a-z\s]+)/,
    /creating.*?([a-z\s]+)/,
    /developing.*?([a-z\s]+)/,
    /startup.*?([a-z\s]*)/,
    /business.*?([a-z\s]*)/,
    /web development.*?([a-z\s]*)/,
    /mobile app.*?([a-z\s]*)/,
    /ai.*?([a-z\s]*)/,
    /machine learning.*?([a-z\s]*)/,
    /saas.*?([a-z\s]*)/
  ]
  
  let extractedConcepts: string[] = []
  
  // Try to match domain patterns
  for (const pattern of domainPatterns) {
    const match = text.match(pattern)
    if (match) {
      const concept = match[0].replace(/project ideas?/g, '').trim()
      if (concept) {
        extractedConcepts.push(concept)
      }
    }
  }
  
  // Extract compound phrases (2-3 words) that are likely meaningful
  const words = text.replace(/[^WSZXYZ[\]^_`abcdefghijklmnopqrstuvwxyz]/g, ' ').split(/\s+/)
  const phrases: string[] = []
  
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i]
    const word2 = words[i + 1]
    const word3 = words[i + 2]
    
    if (!stopWords.has(word1) && !stopWords.has(word2)) {
      // Two-word phrases
      if (word1.length > 2 && word2.length > 2) {
        phrases.push(`${word1} ${word2}`)
      }
      
      // Three-word phrases
      if (word3 && !stopWords.has(word3) && word3.length > 2) {
        phrases.push(`${word1} ${word2} ${word3}`)
      }
    }
  }
  
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
  keywords: string[],
  redditData: any[],
  xData: any[]
): Promise<string[]> {
  try {
    console.log('🤖 Attempting AI analysis with Perplexity Sonar...');

    return await retryWithBackoff(async () => {
      const analysisPrompt = `You are a business idea generator. Based on the user's request and market research data, generate 5 specific, actionable SaaS/business ideas.

User Request: "${prompt}"
Focus Areas: ${keywords.join(', ')}

Market Research Data:
Reddit Discussions: ${redditData.slice(0, 10).map((post, i) => `${i+1}. ${post.title || post.content}`).join('  ')}

Twitter/X Discussions: ${xData.slice(0, 10).map((post, i) => `${i+1}. ${post.content}`).join('  ')}

Requirements:
1. Generate exactly 5 business/SaaS ideas
2. Each idea should be specific and actionable
3. Address real problems mentioned in the research data
4. Be relevant to the focus areas: ${keywords.join(', ')}
5. Include a brief description of the solution

Format each idea as: "Idea Name: Brief description of what it does and the problem it solves"

Ideas:`;

      const data = await makePerplexityRequest(analysisPrompt);
      const text = data.choices[0].message.content.trim();

      // Parse ideas from the response
      const ideas = text
        .split('\n')
        .map((idea: string) => idea.trim())
        .filter((idea: string) => idea.length > 10) // Filter out very short lines
        .map((idea: string) => idea.replace(/^\d+\.?\s*/, '')) // Remove numbering
        .slice(0, 5); // Ensure we only return 5 ideas

      if (ideas.length === 0) {
        throw new Error('No ideas generated from AI response');
      }

      console.log('✅ AI idea generation successful:', ideas.length, 'ideas');
      return ideas;
    });
  } catch (error: any) {
    console.warn('⚠️ AI idea generation failed, using enhanced fallback method:', error.message);

    // Enhanced fallback idea generation
    const fallbackIdeas = generateEnhancedFallbackIdeas(prompt, keywords, redditData, xData);
    console.log('🔄 Enhanced fallback ideas generated:', fallbackIdeas.length, 'ideas');

    return fallbackIdeas;
  }
}

// Enhanced fallback idea generation with better context understanding
function generateEnhancedFallbackIdeas(
  prompt: string,
  keywords: string[],
  redditData: any[],
  xData: any[]
): string[] {
  const primaryKeyword = keywords[0] || 'business solution';
  const secondaryKeyword = keywords[1] || 'automation tool';

  // Extract problems from scraped data
  const allContent = [
    ...redditData.slice(0, 5).map(post => post.title || post.content || ''),
    ...xData.slice(0, 5).map(post => post.content || '')
  ].filter(content => content.length > 10);

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

  // If we have scraped content, try to incorporate real problems
  if (allContent.length > 0) {
    const problem = allContent[0].substring(0, 150).replace(/[^WSZXYZ[\]^_`abcdefghijklmnopqrstuvwxyz]/g, ' ').trim();
    if (problem.length > 20) {
      templates[0] = `Problem Solver for "${problem}...": A ${primaryKeyword} solution that directly addresses this common issue in the ${secondaryKeyword} space.`;
    }
  }

  return templates;
}
