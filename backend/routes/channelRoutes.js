import express from 'express';
import {
  createChannel,
  getMyChannel,
  getChannelById,
} from '../controllers/channelController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createChannel);
router.get('/my', protect, getMyChannel);
router.get('/:id', getChannelById);

export default router;