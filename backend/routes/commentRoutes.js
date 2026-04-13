import express from 'express';
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:videoId', protect, addComment);
router.get('/:videoId', getComments);
router.put('/comment/:commentId', protect, updateComment);
router.delete('/comment/:commentId', protect, deleteComment);

export default router;