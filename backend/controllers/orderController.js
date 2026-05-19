import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Payment Intent
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    if (product.isSold) {
      res.status(400);
      throw new Error('Product is already sold');
    }

    const amount = product.price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        productId: product._id.toString(),
        buyerId: req.user._id.toString(),
        sellerId: product.seller.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order after payment
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { productId, paymentIntentId, paymentStatus } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const order = new Order({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
      paymentIntentId,
      paymentStatus,
      price: product.price,
    });

    const createdOrder = await order.save();
    
    if (paymentStatus === 'completed') {
      product.isSold = true;
      await product.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('product', 'title images price')
      .populate('seller', 'name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export { createPaymentIntent, createOrder, getMyOrders };
