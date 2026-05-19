import Message from '../models/Message.js';

// @desc    Get chat history with a specific user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of users you have chatted with
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: -1 });

    const conversations = [];
    const userIds = new Set();

    messages.forEach((msg) => {
      let otherUser = null;
      if (msg.sender._id.toString() !== currentUserId.toString()) {
        otherUser = msg.sender;
      } else {
        otherUser = msg.receiver;
      }

      if (!userIds.has(otherUser._id.toString())) {
        userIds.add(otherUser._id.toString());
        conversations.push(otherUser);
      }
    });

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

export { getChatHistory, getConversations };
