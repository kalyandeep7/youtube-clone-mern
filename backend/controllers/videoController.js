import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// GET ALL VIDEOS (with optional search & category filter)
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query).populate('channelId', 'channelName');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE VIDEO
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('channelId', 'channelName')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username avatar' },
      });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE VIDEO (protected)
export const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, channelId, category } = req.body;

    if (!title || !videoUrl || !channelId) {
      return res.status(400).json({ message: 'Title, videoUrl and channelId are required' });
    }

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channelId,
      uploader: req.user.id,
      category: category || 'All',
    });

    // Add video to channel
    await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VIDEO (protected)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this video' });
    }

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE VIDEO (protected)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    await video.deleteOne();

    // Remove video from channel
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id },
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIKE VIDEO (protected)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.likes.includes(req.user.id)) {
      // Already liked — remove like (toggle off)
      video.likes.pull(req.user.id);
    } else {
      // Add like and remove dislike if exists
      video.likes.push(req.user.id);
      video.dislikes.pull(req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DISLIKE VIDEO (protected)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.dislikes.includes(req.user.id)) {
      // Already disliked — remove dislike (toggle off)
      video.dislikes.pull(req.user.id);
    } else {
      // Add dislike and remove like if exists
      video.dislikes.push(req.user.id);
      video.likes.pull(req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};