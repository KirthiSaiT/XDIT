import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { DatabaseService } from '@/backend/services/database'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    const ideas = await DatabaseService.getProjectIdeasByUserId(userId, 50) // Get last 50 ideas

    return NextResponse.json({
      success: true,
      ideas: ideas
    })
  } catch (error) {
    console.error('Error fetching user history:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user history'
    }, { status: 500 })
  }
}
