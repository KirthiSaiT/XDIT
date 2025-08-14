'use client'

import { useState, useEffect } from 'react'
import { 
  History, 
  Lightbulb, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Eye
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface ProjectIdea {
  _id: string
  idea: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  techStack: string[]
  createdAt: string
  keywords: string[]
}

interface HistorySidebarProps {
  isOpen: boolean
  onToggle: () => void
  onSelectIdea: (idea: ProjectIdea) => void
}

export function HistorySidebar({ isOpen, onToggle, onSelectIdea }: HistorySidebarProps) {
  const { user, isLoaded } = useUser()
  const [ideas, setIdeas] = useState<ProjectIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserHistory()
    }
  }, [isLoaded, user])

  const fetchUserHistory = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/user-history')
      if (response.ok) {
        const data = await response.json()
        setIdeas(data.ideas || [])
      }
    } catch (error) {
      console.error('Error fetching user history:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteIdea = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/user-history/${ideaId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setIdeas(ideas.filter(idea => idea._id !== ideaId))
        if (selectedIdea === ideaId) {
          setSelectedIdea(null)
        }
      }
    } catch (error) {
      console.error('Error deleting idea:', error)
    }
  }

  const handleIdeaClick = (idea: ProjectIdea) => {
    setSelectedIdea(idea._id)
    onSelectIdea(idea)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl transition-transform duration-300 ease-in-out z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-10 top-4 bg-white border border-gray-200 rounded-l-lg rounded-r-none shadow-md hover:bg-gray-50 px-2 py-2"
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Sidebar Content */}
      <div className="w-80 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your History</h2>
              <p className="text-sm text-gray-600">Generated project ideas</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No ideas generated yet</p>
              <p className="text-gray-400 text-xs">Start generating ideas to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div 
                  key={idea._id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg border bg-white p-4 ${
                    selectedIdea === idea._id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleIdeaClick(idea)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {idea.idea}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteIdea(idea._id)
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {idea.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(idea.difficulty)}`}>
                        {idea.difficulty}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(idea.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {idea.techStack.slice(0, 3).map((tech, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border">
                          {tech}
                        </span>
                      ))}
                      {idea.techStack.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border">
                          +{idea.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{ideas.length} ideas generated</span>
            <button
              onClick={fetchUserHistory}
              className="h-6 px-2 text-xs hover:bg-gray-200 rounded"
            >
              <Eye className="h-3 w-3 mr-1 inline" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
