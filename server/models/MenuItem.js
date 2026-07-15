import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
   },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=Food+Item',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      default: 'Medium',
    },
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
    calories: Number,
    nutritionalInfo: {
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    // For combo meals
    includedItems: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
        },
        quantity: Number,
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
menuItemSchema.index({ restaurant: 1, category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('MenuItem', menuItemSchema);