import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  note: {
    type: String,
    maxlength: [200, 'Note cannot exceed 200 characters'],
    trim: true,
  },
  priceAtAdd: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
});

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, 
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      default: null,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate total before save
cartSchema.pre('save', function () {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.priceAtAdd * item.quantity);
  }, 0);
  return;
});

// Optional: Better index for performance
cartSchema.index({ customer: 1, isActive: 1 });

export default mongoose.model('Cart', cartSchema);