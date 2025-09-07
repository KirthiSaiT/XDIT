// src/app/api/ideas/[id]/route.ts
import { NextResponse } from 'next/server'
import { DatabaseService } from '@/backend/services/database'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid ID format: ${ideaId}. Please use a valid MongoDB ObjectId.` 
        },
        { status: 400 }
      )
    }
    
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
    
    // Check if it's a CastError (invalid ObjectId)
    if (error instanceof Error && error.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid ID format. This appears to be an old-style ID that is no longer supported.' 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch idea' },
      { status: 500 }
    )
  }
}