const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'ankitpatna234@gmail.com' });
    if (existingUser) {
      console.log('User already exists!');
      process.exit();
    }

    // Create the admin user
    await User.create({
      name: 'Ankit Singh',
      email: 'ankitpatna234@gmail.com',
      password: 'password123',
      role: 'Admin',
      department: 'Management'
    });

    console.log('Admin user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
