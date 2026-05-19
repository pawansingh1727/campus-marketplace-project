import express from 'express';
import {
  createPaymentIntent,
  createOrder,
  getMyOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

export default router;
