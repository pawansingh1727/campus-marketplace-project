import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Books', 'Electronics', 'Furniture', 'Notes', 'Others'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    },
    isSold: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
