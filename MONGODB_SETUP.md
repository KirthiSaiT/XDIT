# MongoDB Setup Guide for xxit

## 🚀 Quick Start

### 1. Install MongoDB Dependencies

```bash
npm install mongoose
npm install --save-dev @types/mongoose
```

### 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/xxit
MONGODB_DATABASE=xxit

# Perplexity AI Configuration
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### 3. MongoDB Installation Options

#### Option A: Local MongoDB Installation
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env.local`

#### Option C: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Test Connection

Start your development server:
```bash
npm run dev
```

Test the MongoDB connection:
```bash
curl http://localhost:3000/api/test-mongodb
```

## 📊 Database Models

### ProjectIdea Schema
- **idea**: Project title (required)
- **description**: Detailed description (required)
- **marketNeed**: Market problem it solves (required)
- **techStack**: Array of technologies (required)
- **difficulty**: Easy/Medium/Hard (required)
- **estimatedTime**: Development time estimate (required)
- **keywords**: Searchable keywords (required)
- **sources**: Research sources
- **userId**: Associated user (optional)
- **isPublic**: Public visibility (default: true)
- **likes**: Like count (default: 0)
- **views**: View count (default: 0)
- **status**: draft/published/archived (default: published)

### User Schema
- **clerkId**: Clerk authentication ID (required)
- **email**: User email (required)
- **username**: Unique username (optional)
- **preferences**: User preferences and interests
- **stats**: User activity statistics
- **subscription**: Subscription plan and features

## 🔧 API Endpoints

### Test MongoDB Connection
- **GET** `/api/test-mongodb` - Test database connection and get stats

### Test Database Operations
- **POST** `/api/test-mongodb` - Create test data
  ```json
  {
    "action": "create_test_idea" | "create_test_user" | "clear_test_data"
  }
  ```

### Generate Ideas (Updated)
- **POST** `/api/generate-ideas` - Generate and save ideas to MongoDB

## 🗄️ Database Operations

The `DatabaseService` class provides:

- **Project Ideas**: CRUD operations, trending ideas, search, filtering
- **Users**: User management, preferences, statistics
- **Analytics**: Database statistics, user activity tracking
- **Utilities**: Connection management, test data operations

## 📈 Features Enabled

With MongoDB integration, you can now:

1. **Persist Ideas**: All generated ideas are saved to the database
2. **User Management**: Track user preferences and activity
3. **Community Features**: Like, view, and share ideas
4. **Search & Filter**: Find ideas by difficulty, tech stack, keywords
5. **Analytics**: Track popular ideas and user engagement
6. **Personalization**: User-specific idea recommendations

## 🚨 Troubleshooting

### Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Check connection string format
mongodb://username:password@host:port/database
```

### Common Errors
- **ECONNREFUSED**: MongoDB service not running
- **Authentication failed**: Wrong credentials
- **Database not found**: Database doesn't exist (will be created automatically)

### Debug Mode
Enable detailed logging in your MongoDB connection:
```typescript
// In mongodb.ts
mongoose.set('debug', true)
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Connection String**: Use strong passwords and restrict network access
3. **Indexes**: Database indexes are automatically created for performance
4. **Validation**: All data is validated before saving

## 📚 Next Steps

1. **User Authentication**: Integrate with Clerk for user management
2. **Community Features**: Add likes, comments, and sharing
3. **Analytics Dashboard**: Show trending ideas and user statistics
4. **Personalization**: Recommend ideas based on user preferences
5. **Export Features**: Allow users to export their ideas

## 🆘 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify MongoDB is running and accessible
3. Confirm environment variables are set correctly
4. Test the connection endpoint first
