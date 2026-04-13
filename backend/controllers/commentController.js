import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

// ADD COMMENT (protected)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      videoId: req.params.videoId,
      userId: req.user.id,
      text,
    });

    // Add comment to video
    await Video.findByIdAndUpdate(req.params.videoId, {
      $push: { comments: comment._id },
    });

    // Return comment with user details
    const populated = await comment.populate('userId', 'username avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL COMMENTS FOR A VIDEO (public)
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE COMMENT (protected)
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT (protected)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    // Remove comment from video
    await Video.findByIdAndUpdate(comment.videoId, {
      $pull: { comments: comment._id },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};