import { NextResponse } from 'next/server'
import { DatabaseService } from '@/backend/services/database'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const ideaId = context.params.id
    const idea = await DatabaseService.getProjectIdeaById(ideaId)

    if (!idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      idea
    })
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch idea' },
      { status: 500 }
    )
  }
}
