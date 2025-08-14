import { ensureConnection } from '../config/mongodb'
import { ProjectIdea, IProjectIdea } from '../models/ProjectIdea'
import { User, IUser } from '../models/User'

export class DatabaseService {
  // Project Idea Operations
  static async createProjectIdea(ideaData: Partial<IProjectIdea>): Promise<IProjectIdea> {
    await ensureConnection()
    
    try {
      const projectIdea = new ProjectIdea(ideaData)
      const savedIdea = await projectIdea.save()
      
      console.log(`✅ Project idea created: ${savedIdea.idea}`)
      return savedIdea
    } catch (error) {
      console.error('❌ Error creating project idea:', error)
      throw error
    }
  }

  static async getProjectIdeaById(id: string): Promise<IProjectIdea | null> {
    await ensureConnection()
    
    try {
      const idea = await ProjectIdea.findById(id)
      if (idea) {
        // Increment view count
        idea.views += 1
        await idea.save()
      }
      return idea
    } catch (error) {
      console.error('❌ Error fetching project idea:', error)
      throw error
    }
  }

  static async getTrendingIdeas(limit = 10): Promise<IProjectIdea[]> {
    await ensureConnection()
    
    try {
      return await ProjectIdea.findTrending(limit)
    } catch (error) {
      console.error('❌ Error fetching trending ideas:', error)
      throw error
    }
  }

  static async getIdeasByDifficulty(difficulty: string, limit = 20): Promise<IProjectIdea[]> {
    await ensureConnection()
    
    try {
      return await ProjectIdea.findByDifficulty(difficulty, limit)
    } catch (error) {
      console.error('❌ Error fetching ideas by difficulty:', error)
      throw error
    }
  }

  static async searchIdeas(searchTerm: string, limit = 20): Promise<IProjectIdea[]> {
    await ensureConnection()
    
    try {
      return await ProjectIdea.searchIdeas(searchTerm, limit)
    } catch (error) {
      console.error('❌ Error searching ideas:', error)
      throw error
    }
  }

  static async getProjectIdeasByUserId(userId: string, limit = 20): Promise<IProjectIdea[]> {
    await ensureConnection()
    
    try {
      return await ProjectIdea.find({ userId, status: { $ne: 'archived' } })
        .sort({ createdAt: -1 })
        .limit(limit)
    } catch (error) {
      console.error('❌ Error fetching user project ideas:', error)
      throw error
    }
  }

  static async updateProjectIdea(id: string, updateData: Partial<IProjectIdea>): Promise<IProjectIdea | null> {
    await ensureConnection()
    
    try {
      const updatedIdea = await ProjectIdea.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      
      if (updatedIdea) {
        console.log(`✅ Project idea updated: ${updatedIdea.idea}`)
      }
      
      return updatedIdea
    } catch (error) {
      console.error('❌ Error updating project idea:', error)
      throw error
    }
  }

  // Delete project idea
  static async deleteProjectIdea(id: string): Promise<boolean> {
    await ensureConnection()
    
    try {
      const result = await ProjectIdea.findByIdAndDelete(id)
      if (result) {
        console.log(`✅ Project idea deleted: ${result.idea}`)
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Error deleting project idea:', error)
      throw error
    }
  }

  static async likeProjectIdea(id: string): Promise<IProjectIdea | null> {
    await ensureConnection()
    
    try {
      const idea = await ProjectIdea.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      )
      
      if (idea) {
        console.log(`✅ Project idea liked: ${idea.idea} (${idea.likes} likes)`)
      }
      
      return idea
    } catch (error) {
      console.error('❌ Error liking project idea:', error)
      throw error
    }
  }

  // User Operations
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    await ensureConnection()
    
    try {
      const user = new User(userData)
      const savedUser = await user.save()
      
      console.log(`✅ User created: ${savedUser.email}`)
      return savedUser
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw error
    }
  }

  static async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    await ensureConnection()
    
    try {
      return await User.findOne({ clerkId })
    } catch (error) {
      console.error('❌ Error fetching user by Clerk ID:', error)
      throw error
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    await ensureConnection()
    
    try {
      return await User.findOne({ email: email.toLowerCase() })
    } catch (error) {
      console.error('❌ Error fetching user by email:', error)
      throw error
    }
  }

  static async updateUser(clerkId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    await ensureConnection()
    
    try {
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      
      if (updatedUser) {
        console.log(`✅ User updated: ${updatedUser.email}`)
      }
      
      return updatedUser
    } catch (error) {
      console.error('❌ Error updating user:', error)
      throw error
    }
  }

  static async updateUserStats(clerkId: string, statType: 'generated' | 'saved' | 'liked' | 'searched'): Promise<void> {
    await ensureConnection()
    
    try {
      const user = await User.findOne({ clerkId })
      if (user) {
        await user.updateStats(statType)
      }
    } catch (error) {
      console.error('❌ Error updating user stats:', error)
      throw error
    }
  }

  static async getUsersByInterests(interests: string[], limit = 20): Promise<IUser[]> {
    await ensureConnection()
    
    try {
      return await User.findByInterests(interests, limit)
    } catch (error) {
      console.error('❌ Error fetching users by interests:', error)
      throw error
    }
  }

  static async getActiveUsers(days = 7, limit = 50): Promise<IUser[]> {
    await ensureConnection()
    
    try {
      return await User.findActiveUsers(days, limit)
    } catch (error) {
      console.error('❌ Error fetching active users:', error)
      throw error
    }
  }

  // Analytics Operations
  static async getDatabaseStats(): Promise<{
    totalUsers: number
    totalIdeas: number
    totalLikes: number
    totalViews: number
    activeUsersLast7Days: number
  }> {
    await ensureConnection()
    
    try {
      const [
        totalUsers,
        totalIdeas,
        totalLikes,
        totalViews,
        activeUsersLast7Days
      ] = await Promise.all([
        User.countDocuments(),
        ProjectIdea.countDocuments({ status: 'published' }),
        ProjectIdea.aggregate([
          { $match: { status: 'published' } },
          { $group: { _id: null, total: { $sum: '$likes' } } }
        ]).then(result => result[0]?.total || 0),
        ProjectIdea.aggregate([
          { $match: { status: 'published' } },
          { $group: { _id: null, total: { $sum: '$views' } } }
        ]).then(result => result[0]?.total || 0),
        User.countDocuments({
          'stats.lastActive': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      ])

      return {
        totalUsers,
        totalIdeas,
        totalLikes,
        totalViews,
        activeUsersLast7Days
      }
    } catch (error) {
      console.error('❌ Error fetching database stats:', error)
      throw error
    }
  }

  // Utility Operations
  static async isConnected(): Promise<boolean> {
    try {
      await ensureConnection()
      return true
    } catch (error) {
      return false
    }
  }

  static async clearTestData(): Promise<void> {
    await ensureConnection()
    
    try {
      await Promise.all([
        ProjectIdea.deleteMany({}),
        User.deleteMany({})
      ])
      console.log('✅ Test data cleared')
    } catch (error) {
      console.error('❌ Error clearing test data:', error)
      throw error
    }
  }

  // Ensure all indexes are created
  static async ensureIndexes(): Promise<void> {
    await ensureConnection()
    
    try {
      // Create indexes for User model
      await User.createIndexes()
      
      // Create indexes for ProjectIdea model
      await ProjectIdea.createIndexes()
      
      console.log('✅ All database indexes created successfully')
    } catch (error) {
      console.error('❌ Error creating indexes:', error)
      throw error
    }
  }
}
