import Order from '../models/Order.js';
import RiderLocation from '../models/RiderLocation.js';
import User from '../models/User.js';
import { io } from '../server.js';

// @desc    Get orders assigned to the logged-in rider
// @route   GET /api/rider/my-deliveries
// @access  Private (Rider only)
export const getMyDeliveries = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { rider: req.user._id };

    if (status) {
      query.status = status;
    } else {
      // Default: show active deliveries only
      query.status = { $in: ['assigned', 'out_for_delivery'] };
    }

    const orders = await Order.find(query)
      .populate('customer', 'username phone')
      .populate('restaurant', 'name logo address phone')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get my deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message,
    });
  }
};

// @desc    Get rider's delivery history (delivered/cancelled)
// @route   GET /api/rider/history
// @access  Private (Rider only)
export const getDeliveryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      rider: req.user._id,
      status: { $in: ['delivered', 'cancelled'] },
    };

    const orders = await Order.find(query)
      .populate('customer', 'username')
      .populate('restaurant', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get delivery history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery history',
      error: error.message,
    });
  }
};

// @desc    Toggle rider online/offline availability
// @route   PATCH /api/rider/availability
// @access  Private (Rider only)
export const toggleAvailability = async (req, res) => {
  try {
    const rider = await User.findById(req.user._id);

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: 'Rider not found',
      });
    }

    rider.availability = rider.availability === 'online' ? 'offline' : 'online';

    await rider.save();

    res.status(200).json({
      success: true,
      message: `You are now ${rider.availability}`,
      data: {
        availability: rider.availability,
      },
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message,
    });
  }
};

// @desc    Update rider's live location for an active order
// @route   POST /api/rider/location
// @access  Private (Rider only)
export const updateLocation = async (req, res) => {
  try {
    const { orderId, latitude, longitude, accuracy, speed, heading } = req.body;

    if (!orderId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'orderId, latitude, and longitude are required',
      });
    }

    // Verify this order belongs to this rider
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.rider?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update location for this order',
      });
    }

    const locationEntry = await RiderLocation.create({
      rider: req.user._id,
      order: orderId,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      accuracy,
      speed,
      heading,
    });

    // Broadcast live location to anyone tracking this order
    io.to(`order_${orderId}`).emit('rider:location_update', {
      orderId,
      riderId: req.user._id,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      data: locationEntry,
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message,
    });
  }
};

// @desc    Get latest rider location for an order (customer/owner tracking)
// @route   GET /api/rider/location/:orderId
// @access  Private
export const getLatestLocation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      'restaurant',
      'owner',
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isCustomer = order.customer.toString() === req.user._id.toString();
    const isOwner = order.restaurant?.owner?.toString() === req.user._id.toString();
    const isRider = order.rider?.toString() === req.user._id.toString();

    if (!isCustomer && !isOwner && !isRider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this location',
      });
    }

    const latestLocation = await RiderLocation.findOne({
      order: req.params.orderId,
    }).sort({ timestamp: -1 });

    if (!latestLocation) {
      return res.status(404).json({
        success: false,
        message: 'No location data available yet',
      });
    }

    res.status(200).json({
      success: true,
      data: latestLocation,
    });
  } catch (error) {
    console.error('Get latest location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message,
    });
  }
};


// @desc    Get rider availability
// @route   GET /api/rider/availability
// @access  Private (Rider only)
export const getAvailability = async (req, res) => {
  try {
    const rider = await User.findById(req.user._id).select(
      "availability"
    );

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        availability: rider.availability,
      },
    });
  } catch (error) {
    console.error("Get availability error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching availability",
      error: error.message,
    });
  }
};