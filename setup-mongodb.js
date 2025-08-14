#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MongoDB Setup for xxit\n');

// Check if MongoDB is already running
function checkMongoDB() {
  try {
    execSync('mongosh --eval "db.runCommand(\'ping\')" --quiet', { stdio: 'ignore' });
    console.log('✅ MongoDB is already running!');
    return true;
  } catch (error) {
    return false;
  }
}

// Check if MongoDB is installed
function checkMongoDBInstallation() {
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Start MongoDB service
function startMongoDB() {
  const platform = process.platform;
  
  try {
    if (platform === 'win32') {
      console.log('🔄 Starting MongoDB service on Windows...');
      execSync('net start MongoDB', { stdio: 'ignore' });
    } else if (platform === 'darwin') {
      console.log('🔄 Starting MongoDB service on macOS...');
      execSync('brew services start mongodb-community', { stdio: 'ignore' });
    } else if (platform === 'linux') {
      console.log('🔄 Starting MongoDB service on Linux...');
      execSync('sudo systemctl start mongod', { stdio: 'ignore' });
    }
    
    // Wait a bit for the service to start
    setTimeout(() => {
      if (checkMongoDB()) {
        console.log('✅ MongoDB started successfully!');
      } else {
        console.log('⚠️ MongoDB service started but connection failed. Please check manually.');
      }
    }, 3000);
    
  } catch (error) {
    console.log('❌ Failed to start MongoDB service automatically');
    console.log('💡 Please start MongoDB manually:');
    
    if (platform === 'win32') {
      console.log('   - Open Services (services.msc)');
      console.log('   - Find "MongoDB" service and start it');
    } else if (platform === 'darwin') {
      console.log('   - Run: brew services start mongodb-community');
    } else if (platform === 'linux') {
      console.log('   - Run: sudo systemctl start mongod');
    }
  }
}

// Install MongoDB using Docker
function installMongoDBDocker() {
  console.log('🐳 Installing MongoDB using Docker...');
  
  try {
    // Check if Docker is running
    execSync('docker --version', { stdio: 'ignore' });
    
    // Check if MongoDB container already exists
    try {
      execSync('docker ps -a --filter "name=mongodb" --format "{{.Names}}"', { stdio: 'pipe' });
      const containerExists = execSync('docker ps -a --filter "name=mongodb" --format "{{.Names}}"', { encoding: 'utf8' }).trim();
      
      if (containerExists) {
        console.log('🔄 Starting existing MongoDB container...');
        execSync('docker start mongodb', { stdio: 'ignore' });
      } else {
        console.log('🔄 Creating new MongoDB container...');
        execSync('docker run -d -p 27017:27017 --name mongodb mongo:latest', { stdio: 'ignore' });
      }
      
      setTimeout(() => {
        if (checkMongoDB()) {
          console.log('✅ MongoDB Docker container started successfully!');
        } else {
          console.log('⚠️ MongoDB container started but connection failed. Please check manually.');
        }
      }, 3000);
      
    } catch (error) {
      console.log('❌ Failed to manage Docker container');
    }
    
  } catch (error) {
    console.log('❌ Docker is not installed or not running');
    console.log('💡 Please install Docker Desktop or use a local MongoDB installation');
  }
}

// Main setup logic
function main() {
  if (checkMongoDB()) {
    console.log('🎉 MongoDB is ready to use!');
    return;
  }
  
  if (checkMongoDBInstallation()) {
    console.log('📦 MongoDB is installed but not running');
    startMongoDB();
  } else {
    console.log('📦 MongoDB is not installed');
    console.log('\n💡 Installation options:');
    console.log('1. Install MongoDB locally:');
    console.log('   - Windows: choco install mongodb');
    console.log('   - macOS: brew tap mongodb/brew && brew install mongodb-community');
    console.log('   - Linux: sudo apt-get install mongodb');
    console.log('\n2. Use Docker (recommended for development):');
    console.log('   - Install Docker Desktop');
    console.log('   - Run this script again');
    
    // Try Docker installation
    installMongoDBDocker();
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Make sure MongoDB is running on port 27017');
  console.log('2. Create a .env.local file with: MONGODB_URI=mongodb://localhost:27017/xxit');
  console.log('3. Restart your development server');
}

// Run the setup
main();
