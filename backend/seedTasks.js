const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const User = require('./models/User');

dotenv.config();

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get the admin user
    const admin = await User.findOne({ email: 'ankitpatna234@gmail.com' });
    if (!admin) {
      console.log('Admin user not found! Run seed.js first.');
      process.exit();
    }

    // Clear existing tasks
    await Task.deleteMany({});

    const mockTasks = [
      {
        title: 'Implement OAuth2.0 Integration',
        description: 'Set up Google and GitHub login using Passport.js. Ensure the user schema supports multiple providers.',
        priority: 'High',
        status: 'To Do',
        order: 0,
        tags: ['Backend', 'Security'],
      },
      {
        title: 'Design Landing Page UI',
        description: 'Create a high-fidelity Figma mockup for the new marketing landing page. Focus on conversion and modern aesthetics.',
        priority: 'Medium',
        status: 'To Do',
        order: 1,
        tags: ['Design', 'Frontend'],
      },
      {
        title: 'Fix Memory Leak in Production',
        description: 'Node.js process is consuming 1.5GB of RAM after 2 hours. Profile the heap and identify the leak.',
        priority: 'High',
        status: 'In Progress',
        order: 0,
        tags: ['Backend', 'Bug', 'Critical'],
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions to automatically run tests and deploy to Vercel on push to main.',
        priority: 'Medium',
        status: 'In Progress',
        order: 1,
        tags: ['DevOps'],
      },
      {
        title: 'Write API Documentation',
        description: 'Document all REST endpoints using Swagger/OpenAPI specification.',
        priority: 'Low',
        status: 'In Review',
        order: 0,
        tags: ['Documentation'],
      },
      {
        title: 'Optimize Database Queries',
        description: 'Add indexes to the Tasks collection and optimize the analytics aggregation pipeline.',
        priority: 'Medium',
        status: 'Completed',
        order: 0,
        tags: ['Database', 'Performance'],
      }
    ];

    // Assign tasks to admin and save
    for (const taskData of mockTasks) {
      await Task.create({
        ...taskData,
        assignedTo: admin._id,
        assignedBy: admin._id,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
    }

    console.log('Dummy tasks seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

seedTasks();
