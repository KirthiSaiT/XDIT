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

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
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
  search_results?: SearchResult[];
}

interface PerplexityResponse {
  text: string;
  tokens?: number;
  metadata?: Record<string, unknown>;
}

interface PerplexityOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  headers?: Record<string, string>;
}

interface PerplexityError {
  message: string;
  code?: string;
  details?: unknown;
}

interface AxiosErrorResponse {
  status: number;
  data: unknown;
}

interface AxiosError {
  response?: AxiosErrorResponse;
  request?: unknown;
  message: string;
}

export class PerplexityService {
  static async testConnection(): Promise<boolean> {
    try {
      const response = await axios.post(
        PERPLEXITY_API_URL,
        {
          model: 'sonar',
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('API connection test failed:', axiosError.response?.status, axiosError.response?.data);
      return false;
    }
  }

  static async chat(
    messages: PerplexityMessage[],
    model: string = 'sonar'
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
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.error('401 Unauthorized: Check your API key. Raw error response:', axiosError.response?.data);
        console.error('Request headers sent:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY?.substring(0, 8)}...`
        });
        throw new Error('Authentication failed. Please ensure your PERPLEXITY_API_KEY is correct and active. You can find it in your Perplexity AI account settings.');
      } else if (axiosError.response) {
        console.error('Error communicating with Perplexity AI. Status:', axiosError.response.status, 'Data:', axiosError.response.data);
        throw new Error(`Perplexity AI API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      } else if (axiosError.request) {
        console.error('No response received from Perplexity AI. Request details:', axiosError.request);
        throw new Error('No response received from Perplexity AI. Please check your network connection or the API service status.');
      } else {
        console.error('Error setting up request to Perplexity AI:', axiosError.message);
        throw new Error(`Error setting up request to Perplexity AI: ${axiosError.message}`);
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

      const response = await this.chat(messages, 'sonar');
      const content = response.choices[0].message.content;
      
      try {
        // Try to parse JSON response
        const keywords = JSON.parse(content);
        if (Array.isArray(keywords)) {
          return keywords.filter(k => typeof k === 'string' && k.trim().length > 0);
        }
      } catch { // The unused 'parseError' variable has been removed here.
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

  static async makeRequest(
    prompt: string,
    options: PerplexityOptions
  ): Promise<PerplexityResponse> {
    try {
      const response = await fetch('https://api.perplexity.ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          ...options.headers
        },
        body: JSON.stringify({
          model: options.model || 'sonar-medium-online',
          prompt,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1024,
          top_p: options.topP || 1
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const result = await response.json() as PerplexityResponse;
      return result;
    } catch (error: unknown) {
      const perplexityError: PerplexityError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'PERPLEXITY_API_ERROR'
      };
      throw perplexityError;
    }
  }
}
