#!/usr/bin/env node

const mongoose = require('mongoose');

// Test MongoDB connection
async function testMongoDB() {
  console.log('🧪 Testing MongoDB Connection...\n');
  
  try {
    // Try to connect to local MongoDB
    const uri = 'mongodb://localhost:27017/xxit';
    console.log(`📍 Connecting to: ${uri}`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    console.log('\n🧪 Testing basic operations...');
    
    // Test database creation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Collections found: ${collections.length}`);
    
    // Test if we can create a simple document
    const testCollection = db.collection('test');
    const result = await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date() 
    });
    console.log(`✅ Test document created with ID: ${result.insertedId}`);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    console.log('\n🎉 All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('\n❌ MongoDB test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB is not running. Please:');
      console.log('1. Start MongoDB service');
      console.log('2. Or run: npm run setup-mongodb');
      console.log('3. Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    } else if (error.message.includes('IP that isn\'t whitelisted')) {
      console.log('\n💡 Your IP is not whitelisted in MongoDB Atlas.');
      console.log('Please use a local MongoDB instance instead.');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the test
testMongoDB();
