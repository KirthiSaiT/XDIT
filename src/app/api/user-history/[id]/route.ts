import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { DatabaseService } from '@/backend/services/database'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // params can be a Promise in App Router
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: ideaId } = await context.params // ✅ Await params before accessing id
    const userId = user.id

    // Verify the idea belongs to the user before deleting
    const idea = await DatabaseService.getProjectIdeaById(ideaId)
    if (!idea || idea.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Not found or unauthorized' },
        { status: 404 }
      )
    }

    await DatabaseService.deleteProjectIdea(ideaId)

    return NextResponse.json({
      success: true,
      message: 'Idea deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete idea' },
      { status: 500 }
    )
  }
}
