import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../backend/services/database'

export async function GET() {
  try {
    // Test database connection
    const isConnected = await DatabaseService.isConnected()
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed' 
        },
        { status: 500 }
      )
    }

    // Get database stats
    const stats = await DatabaseService.getDatabaseStats()
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      data: {
        connection: 'connected',
        stats
      }
    })
    
  } catch (error) {
    console.error('MongoDB test error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'create_test_idea':
        const testIdea = await DatabaseService.createProjectIdea({
          idea: 'Test SaaS Idea',
          description: 'This is a test idea to verify MongoDB functionality',
          marketNeed: 'Testing database operations',
          techStack: ['Node.js', 'MongoDB', 'React'],
          difficulty: 'Easy',
          estimatedTime: '1-2 weeks',
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

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action. Use: create_test_idea, create_test_user, or clear_test_data' 
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
