import express from 'express';
import { getChatHistory, getConversations } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getChatHistory);

export default router;
