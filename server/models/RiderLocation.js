import mongoose from 'mongoose';

const riderLocationSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    location: {
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
    },
    accuracy: Number,
    speed: Number,
    heading: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to auto-delete after 24 hours
riderLocationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('RiderLocation', riderLocationSchema);