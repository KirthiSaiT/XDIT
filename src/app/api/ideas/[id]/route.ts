// src/app/api/ideas/[id]/route.ts
import { NextResponse } from 'next/server'
import { DatabaseService } from '@/backend/services/database'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise<{ id: string }>
) {
  try {
    const { id: ideaId } = await params // Await the params and destructure
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