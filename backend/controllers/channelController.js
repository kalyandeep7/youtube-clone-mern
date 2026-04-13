import Channel from '../models/Channel.js';
import User from '../models/User.js';

// CREATE CHANNEL (protected)
export const createChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    // Check if user already has a channel
    const existing = await Channel.findOne({ owner: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You already have a channel' });
    }

    const channel = await Channel.create({
      channelName,
      description: description || '',
      owner: req.user.id,
    });

    // Add channel to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY CHANNEL (protected)
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user.id }).populate('videos');

    if (!channel) {
      return res.status(404).json({ message: 'No channel found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CHANNEL BY ID (public)
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('videos');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};