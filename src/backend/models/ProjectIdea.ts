import { Schema, model, models, Document } from 'mongoose';

export interface IProjectIdea extends Document {
  title: string;
  description?: string;
  techStack?: string[];
  difficulty?: string;
  createdAt: Date;
  plan?: string;
  metadata: Record<string, unknown>;
}

const ProjectIdeaSchema = new Schema<IProjectIdea>({
  title: {
    type: String,
    required: [true, 'Idea title is required'],
    trim: true,
    maxlength: [200, 'Idea title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  techStack: {
    type: [String],
    required: false,
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
    required: false,
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  plan: {
    type: String,
    required: false
  },
  metadata: {
    type: Object,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
// Create text index for search functionality
ProjectIdeaSchema.index({ title: 'text', description: 'text' })
ProjectIdeaSchema.index({ difficulty: 1, createdAt: -1 })
ProjectIdeaSchema.index({ isPublic: 1, status: 1 })
ProjectIdeaSchema.index({ userId: 1, status: 1 }) // Add index for user queries

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
