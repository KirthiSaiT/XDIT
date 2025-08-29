export interface ProjectIdea {
  _id: string
  idea: string
  description: string
  marketNeed: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  createdAt: string
  keywords: string[]
  sources?: Array<{
    title?: string
    url?: string
    snippet?: string
    source?: string
  }>
}

export interface ProjectIdeaDisplay {
  idea: string
  description: string
  marketNeed: string
  marketValue: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  _id: string
  createdAt: string
  keywords: string[]
  sources?: Array<{
    title?: string
    url?: string
    snippet?: string
    source?: string
  }>
}
