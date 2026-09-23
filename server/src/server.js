import fs from 'fs';
import app from './app.js';
import connectDB from './config/database.config.js';

// Safely load local .env file if present (during development), without throwing on Render/production
if (fs.existsSync('.env') && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch (err) {
    console.warn('Notice: Local .env could not be loaded, using process.env instead');
  }
}

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 AI Resume Builder Server is running!');
      console.log(`   Port: ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Node: ${process.version}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
