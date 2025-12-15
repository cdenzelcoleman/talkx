const mongoose = require('mongoose');
const config = require('./environment');

// I'm creating a reusable database connection function
// I'll handle connection errors and log success/failure clearly
// Using async/await for cleaner error handling

const connectDB = async () => {
  try {
    // I'm connecting to MongoDB (Mongoose 6+ doesn't need useNewUrlParser/useUnifiedTopology options)
    const conn = await mongoose.connect(config.mongodb.uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // I'm logging the database name for debugging purposes
    console.log(`📊 Database: ${conn.connection.name}`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // I'm exiting with failure code so the app doesn't run with broken DB
    process.exit(1);
  }
};

// I'm adding connection event listeners for better visibility
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Error: ${err.message}`);
});

module.exports = connectDB;
