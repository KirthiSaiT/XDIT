import { Schema, model, models, Document } from 'mongoose'

export interface IUser extends Document {
  clerkId: string
  email: string
  username?: string
  firstName?: string
  lastName?: string
  avatar?: string
  preferences: {
    interests: string[]
    difficultyPreference: 'Easy' | 'Medium' | 'Hard' | 'All'
    techStackPreference: string[]
    notificationSettings: {
      email: boolean
      push: boolean
      weeklyDigest: boolean
    }
  }
  stats: {
    ideasGenerated: number
    ideasSaved: number
    ideasLiked: number
    totalSearches: number
    lastActive: Date
  }
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    startDate: Date
    endDate?: Date
    features: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: [true, 'Clerk ID is required'],
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    trim: true
  },
  preferences: {
    interests: {
      type: [String],
      default: [],
      maxlength: [20, 'Cannot have more than 20 interests']
    },
    difficultyPreference: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'All'],
      default: 'All'
    },
    techStackPreference: {
      type: [String],
      default: [],
      maxlength: [15, 'Cannot have more than 15 tech stack preferences']
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      weeklyDigest: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    ideasGenerated: {
      type: Number,
      default: 0,
      min: [0, 'Ideas generated cannot be negative']
    },
    ideasSaved: {
      type: Number,
      default: 0,
      min: [0, 'Ideas saved cannot be negative']
    },
    ideasLiked: {
      type: Number,
      default: 0,
      min: [0, 'Ideas liked cannot be negative']
    },
    totalSearches: {
      type: Number,
      default: 0,
      min: [0, 'Total searches cannot be negative']
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    features: {
      type: [String],
      default: ['basic_idea_generation', 'community_access']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
// Remove duplicate indexes for email and username since unique: true already creates them
UserSchema.index({ 'preferences.interests': 1 })
UserSchema.index({ 'stats.lastActive': -1 })
UserSchema.index({ 'subscription.plan': 1 })

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`
  }
  return this.firstName || this.username || 'Anonymous'
})

// Virtual for subscription status
UserSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.plan === 'free') return true
  if (!this.subscription.endDate) return true
  return this.subscription.endDate > new Date()
})

// Pre-save middleware to update lastActive
UserSchema.pre('save', function(next) {
  this.stats.lastActive = new Date()
  next()
})

// Static method to find users by interests
UserSchema.statics.findByInterests = function(interests: string[], limit = 20) {
  return this.find({
    'preferences.interests': { $in: interests }
  })
    .sort({ 'stats.lastActive': -1 })
    .limit(limit)
}

// Static method to find active users
UserSchema.statics.findActiveUsers = function(days = 7, limit = 50) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return this.find({
    'stats.lastActive': { $gte: cutoffDate }
  })
    .sort({ 'stats.lastActive': -1 })
    .limit(limit)
}

// Instance method to update stats
UserSchema.methods.updateStats = function(type: 'generated' | 'saved' | 'liked' | 'searched') {
  switch (type) {
    case 'generated':
      this.stats.ideasGenerated += 1
      break
    case 'saved':
      this.stats.ideasSaved += 1
      break
    case 'liked':
      this.stats.ideasLiked += 1
      break
    case 'searched':
      this.stats.totalSearches += 1
      break
  }
  this.stats.lastActive = new Date()
  return this.save()
}

export const User = models.User || model<IUser>('User', UserSchema)
