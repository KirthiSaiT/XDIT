import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/backend/config/mongodb'
import { DatabaseService } from '@/backend/services/database'

// The unused '_request' parameter has been removed from the function signature.
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    if (!db) {
      throw new Error('Database connection failed')
    }
    await db.command({ ping: 1 })
        
    // Test index creation
    await DatabaseService.ensureIndexes()
        
    // Test basic operations
    const testUser = await DatabaseService.getUserByClerkId('test-clerk-id')
    const testIdeas = await DatabaseService.getTrendingIdeas(5)
        
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection and operations successful',
      connection: 'Connected',
      indexes: 'Created',
      userCount: testUser ? 1 : 0,
      ideaCount: testIdeas.length
    })
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'MongoDB test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // The unused 'data' variable has been removed from the destructuring.
    const { action } = body
    
    switch (action) {
      case 'create_test_idea':
        const testIdea = await DatabaseService.createProjectIdea({
          title: 'Test SaaS Idea',
          description: 'This is a test idea to verify MongoDB functionality',
          techStack: ['Node.js', 'MongoDB', 'React'],
          difficulty: 'Easy',
          keywords: ['test', 'saas', 'mongodb'],
          isPublic: true,
          status: 'published'
        })
                
        return NextResponse.json({
          success: true,
          message: 'Test idea created successfully',
          data: testIdea
        })
      
      case 'create_test_user':
        const testUser = await DatabaseService.createUser({
          clerkId: 'test-clerk-id',
          email: 'test@example.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User'
        })
                
        return NextResponse.json({
          success: true,
          message: 'Test user created successfully',
          data: testUser
        })
      
      case 'clear_test_data':
        await DatabaseService.clearTestData()
                
        return NextResponse.json({
          success: true,
          message: 'Test data cleared successfully'
        })
      
      case 'test_connection':
        // Moved the testConnection logic here as a POST action
        const { db } = await connectToDatabase()
        if (!db) {
          throw new Error('Database connection failed')
        }
        await db.command({ ping: 1 })
        
        return NextResponse.json({
          success: true,
          message: 'MongoDB connection test successful'
        })
      
      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid action. Use: create_test_idea, create_test_user, clear_test_data, or test_connection'
          },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('MongoDB test action error:', error)
        
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
