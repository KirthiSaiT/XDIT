interface PerplexityResponse {
  text: string;
  metadata: Record<string, unknown>;
}

// The unused 'PerplexityError' interface has been removed.

interface PerplexityOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export class PerplexityService {
  static async makeRequest(
    prompt: string,
    options: PerplexityOptions
  ): Promise<PerplexityResponse> {
    if (!prompt) throw new Error('Prompt is required');
    
    const response = await fetch('https://api.perplexity.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
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

    const data = await response.json();
    return data as PerplexityResponse;
  }
}

// Remove unused parseError function
