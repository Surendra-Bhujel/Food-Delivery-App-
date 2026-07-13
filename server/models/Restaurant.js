import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    cuisineType: {
      type: [String],
      required: true,
      enum: ['Italian', 'Nepali', 'Fast Food', 'Chinese', 'Indian', 'Japanese', 'Mexican', 'Thai', 'American', 'Mediterranean', 'Other'],
    },
    address: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      },
      formattedAddress: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      zipCode: String,
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: String,
      website: String,
    },
    operatingHours: {
      open: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      close: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      daysOpen: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/200x200?text=Restaurant',
    },
    coverImage: String,
    isOpen: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedDeliveryTime: {
      type: Number, // in minutes
      default: 30,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Index for text search
restaurantSchema.index({ name: 'text', description: 'text', 'cuisineType': 'text' });

export default mongoose.model('Restaurant', restaurantSchema);