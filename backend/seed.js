import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import User from './models/User.js';
import Channel from './models/Channel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Video.deleteMany({});
    await User.deleteMany({});
    await Channel.deleteMany({});
    console.log('Cleared existing data');

    // Create a sample user
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = await User.create({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: hashedPassword,
      avatar: '',
    });
    console.log('Sample user created');

    // Create a sample channel
    const channel = await Channel.create({
      channelName: 'Code with John',
      owner: user._id,
      description: 'Coding tutorials and tech reviews by John Doe.',
      subscribers: 5200,
    });

    // Add channel to user
    await User.findByIdAndUpdate(user._id, {
      $push: { channels: channel._id },
    });
    console.log('Sample channel created');

    // Create sample videos
    const videos = await Video.insertMany([
      {
        title: 'Learn React in 30 Minutes',
        description: 'A quick tutorial to get started with React.',
        thumbnailUrl: 'https://picsum.photos/seed/react/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 15200,
        category: 'Web Development',
      },
      {
        title: 'Node.js Crash Course',
        description: 'Learn Node.js from scratch in this crash course.',
        thumbnailUrl: 'https://picsum.photos/seed/node/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 9800,
        category: 'Web Development',
      },
      {
        title: 'Python for Beginners',
        description: 'Complete Python tutorial for absolute beginners.',
        thumbnailUrl: 'https://picsum.photos/seed/python/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 22000,
        category: 'Programming',
      },
      {
        title: 'SQL Full Course',
        description: 'Complete SQL guide for beginners to advanced.',
        thumbnailUrl: 'https://picsum.photos/seed/sql/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 7300,
        category: 'Data Structures',
      },
      {
        title: 'CSS Grid and Flexbox',
        description: 'Master CSS layout with Grid and Flexbox.',
        thumbnailUrl: 'https://picsum.photos/seed/css/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 11500,
        category: 'Web Development',
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning concepts.',
        thumbnailUrl: 'https://picsum.photos/seed/ml/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 30000,
        category: 'Information Technology',
      },
      {
        title: 'JavaScript ES6 Features',
        description: 'Learn all modern JavaScript ES6+ features.',
        thumbnailUrl: 'https://picsum.photos/seed/js/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 18000,
        category: 'JavaScript',
      },
      {
        title: 'MongoDB Tutorial for Beginners',
        description: 'Learn MongoDB from scratch.',
        thumbnailUrl: 'https://picsum.photos/seed/mongo/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 6200,
        category: 'Server',
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Complete DSA course for interviews.',
        thumbnailUrl: 'https://picsum.photos/seed/dsa/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 45000,
        category: 'Data Structures',
      },
      {
        title: 'Top 10 VS Code Extensions',
        description: 'Best VS Code extensions for developers.',
        thumbnailUrl: 'https://picsum.photos/seed/vscode/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 8900,
        category: 'Information Technology',
      },
      {
        title: 'React Hooks Explained',
        description: 'Deep dive into all React hooks.',
        thumbnailUrl: 'https://picsum.photos/seed/hooks/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 25000,
        category: 'JavaScript',
      },
      {
        title: 'Express.js REST API Tutorial',
        description: 'Build a REST API with Express.js.',
        thumbnailUrl: 'https://picsum.photos/seed/express/320/180',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelId: channel._id,
        uploader: user._id,
        views: 13400,
        category: 'Server',
      },
    ]);

    // Add videos to channel
    await Channel.findByIdAndUpdate(channel._id, {
      $push: { videos: { $each: videos.map((v) => v._id) } },
    });

    console.log('Sample videos created');
    console.log('Database seeded successfully!');
    console.log('----------------------------');
    console.log('Sample login credentials:');
    console.log('Email: john@example.com');
    console.log('Password: 123456');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();