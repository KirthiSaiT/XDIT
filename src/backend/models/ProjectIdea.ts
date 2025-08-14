import { Schema, model, models, Document } from 'mongoose'

export interface IProjectIdea extends Document {
  idea: string
  description: string
  marketNeed: string
  techStack: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  sources: any[]
  keywords: string[]
  userId?: string
  isPublic: boolean
  likes: number
  views: number
  status: 'draft' | 'published' | 'archived'
  createdAt: Date
  updatedAt: Date
}

const ProjectIdeaSchema = new Schema<IProjectIdea>({
  idea: {
    type: String,
    required: [true, 'Idea title is required'],
    trim: true,
    maxlength: [200, 'Idea title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  marketNeed: {
    type: String,
    required: [true, 'Market need is required'],
    trim: true,
    maxlength: [1000, 'Market need cannot exceed 1000 characters']
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required'],
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.length <= 20
      },
      message: 'Tech stack must have between 1 and 20 technologies'
    }
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required'],
    default: 'Medium'
  },
  estimatedTime: {
    type: String,
    required: [true, 'Estimated time is required'],
    trim: true
  },
  sources: {
    type: [Schema.Types.Mixed],
    default: []
  },
  keywords: {
    type: [String],
    required: [true, 'Keywords are required'],
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.length <= 50
      },
      message: 'Keywords must have between 1 and 50 items'
    }
  },
  userId: {
    type: String,
    required: false,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
ProjectIdeaSchema.index({ keywords: 'text', idea: 'text', description: 'text' })
ProjectIdeaSchema.index({ difficulty: 1, createdAt: -1 })
ProjectIdeaSchema.index({ likes: -1, createdAt: -1 })
ProjectIdeaSchema.index({ views: -1, createdAt: -1 })
ProjectIdeaSchema.index({ isPublic: 1, status: 1 })

// Virtual for idea popularity score
ProjectIdeaSchema.virtual('popularityScore').get(function() {
  return this.likes * 2 + this.views
})

// Pre-save middleware to ensure keywords are unique
ProjectIdeaSchema.pre('save', function(next) {
  if (this.keywords) {
    this.keywords = [...new Set(this.keywords.map(k => k.toLowerCase().trim()))]
  }
  next()
})

// Static method to find trending ideas
ProjectIdeaSchema.statics.findTrending = function(limit = 10) {
  return this.find({ isPublic: true, status: 'published' })
    .sort({ popularityScore: -1, createdAt: -1 })
    .limit(limit)
}

// Static method to find ideas by difficulty
ProjectIdeaSchema.statics.findByDifficulty = function(difficulty: string, limit = 20) {
  return this.find({ 
    difficulty, 
    isPublic: true, 
    status: 'published' 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
}

// Static method to search ideas
ProjectIdeaSchema.statics.searchIdeas = function(searchTerm: string, limit = 20) {
  return this.find({
    $text: { $search: searchTerm },
    isPublic: true,
    status: 'published'
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
}

export const ProjectIdea = models.ProjectIdea || model<IProjectIdea>('ProjectIdea', ProjectIdeaSchema)
