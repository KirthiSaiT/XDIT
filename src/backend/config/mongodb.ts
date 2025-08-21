import mongoose from 'mongoose'
import { env } from './environment'

interface MongoDBConfig {
  uri: string
  options: {
    maxPoolSize: number
    serverSelectionTimeoutMS: number
    socketTimeoutMS: number
    bufferCommands: boolean
  }
}

class MongoDBConnection {
  private static instance: MongoDBConnection
  private isConnected: boolean = false
  private connectionPromise: Promise<typeof mongoose> | null = null

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection()
    }
    return MongoDBConnection.instance
  }

  private getConfig(): MongoDBConfig {
    const uri = env.mongodb.uri
    
    return {
      uri,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      }
    }
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected) {
      return mongoose
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = this.createConnection()
    return this.connectionPromise
  }

  private async createConnection(): Promise<typeof mongoose> {
    try {
      const config = this.getConfig()
      
      console.log('🔌 Connecting to MongoDB...')
      
      const connection = await mongoose.connect(config.uri, config.options)
      
      this.isConnected = true
      console.log('✅ MongoDB connected successfully')
      
      // Ensure all indexes are created after connection
      try {
        const { DatabaseService } = await import('../services/database')
        await DatabaseService.ensureIndexes()
      } catch (indexError) {
        console.warn('⚠️ Warning: Could not create indexes:', indexError)
      }
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        console.log('🔌 MongoDB disconnected')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected')
        this.isConnected = true
      })

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect()
        process.exit(0)
      })

      process.on('SIGTERM', async () => {
        await this.disconnect()
        process.exit(0)
      })

      return connection
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error)
      this.isConnected = false
      this.connectionPromise = null
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      this.connectionPromise = null
      console.log('🔌 MongoDB disconnected successfully')
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected
  }

  public getConnection(): typeof mongoose | null {
    return this.isConnected ? mongoose : null
  }
}

export const mongodb = MongoDBConnection.getInstance()

// Export mongoose for convenience
export { mongoose }

// Helper function to ensure connection
export async function ensureConnection(): Promise<typeof mongoose> {
  return await mongodb.connect()
}

// Legacy function for backward compatibility
export async function connectToDatabase(): Promise<{ db: typeof mongoose.connection.db }> {
  const connection = await mongodb.connect()
  return { db: connection.connection.db }
}
