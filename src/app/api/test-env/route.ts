import { NextResponse } from 'next/server'
import { PerplexityService } from '@/backend/services/perplexity'

export async function GET() {
  try {
    const envInfo = {
      hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
      keyLength: process.env.PERPLEXITY_API_KEY?.length || 0,
      keyPrefix: process.env.PERPLEXITY_API_KEY?.substring(0, 8) + '...' || 'none',
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('PERPLEXITY'))
    }
    
    // Test the API connection
    const apiTestResult = await PerplexityService.testConnection();
    
    return NextResponse.json({
      ...envInfo,
      apiConnectionTest: apiTestResult,
      message: apiTestResult 
        ? 'API key is valid and connection successful' 
        : 'API key may be invalid or connection failed'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
