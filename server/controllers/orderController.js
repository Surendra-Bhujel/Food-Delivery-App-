import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import { io } from '../server.js';

// @desc    Create order from cart
// @route   POST /api/orders/checkout
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      deliveryInstructions,
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ customer: req.user._id })
      .populate({
        path: 'items.menuItem',
        populate: {
          path: 'restaurant',
          select: 'name deliveryFee estimatedDeliveryTime',
        },
      })
      .populate('restaurant', 'name deliveryFee estimatedDeliveryTime');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Get restaurant
    const restaurant = await Restaurant.findById(cart.restaurant._id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Calculate totals
    const subtotal = cart.totalAmount;
    const deliveryFee = restaurant.deliveryFee || 0;
    const tax = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + deliveryFee + tax;

    // Create order items
    const orderItems = cart.items.map((item) => ({
      menuItem: item.menuItem._id,
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.priceAtAdd,
      note: item.note || '',
    }));

    // Create order
    const order = await Order.create({
      customer: req.user._id,
      restaurant: cart.restaurant._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      deliveryAddress: {
        type: 'Point',
        coordinates: deliveryAddress.coordinates || [0, 0],
        formattedAddress: deliveryAddress.formattedAddress,
        contactNumber: deliveryAddress.contactNumber || req.user.phone,
        instructions: deliveryInstructions || '',
      },
      paymentMethod,
      paymentStatus: 'pending',
      specialInstructions: specialInstructions || '',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed',
        },
      ],
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order for response  
    await order.populate('customer', 'username email phone');
    await order.populate('restaurant');
    await order.populate('items.menuItem', 'name price image');

    // Notify restaurant owner via Socket.IO
    const restaurantOwner = await User.findById(restaurant.owner);
    if (restaurantOwner) {
      io.to(`user_${restaurantOwner._id}`).emit('order:new', {
        orderId: order._id,
        restaurantId: restaurant._id,
        customerName: req.user.username,
        totalAmount: order.totalAmount,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'username email phone')
      .populate('restaurant', 'name logo address phone')
      .populate('rider', 'username phone')
      .populate('items.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user has access to this order
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isOwner = order.restaurant.owner?.toString() === req.user._id.toString();
    const isRider = order.rider?._id?.toString() === req.user._id.toString();

    if (!isCustomer && !isOwner && !isRider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { customer: req.user._id };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('restaurant', 'name logo')
      .populate('rider', 'username')
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
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// @desc    Get restaurant orders (Owner)
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private (Owner only)
export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify restaurant exists and user owns it
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view orders for this restaurant',
      });
    }

    const query = { restaurant: restaurantId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('customer', 'username email phone')
      .populate('rider', 'username phone')
      .populate('items.menuItem', 'name price image')
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
    console.error('Get restaurant orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant orders',
      error: error.message,
    });
  }
};

// @desc    Confirm order (Owner)
// @route   PUT /api/orders/:id/confirm
// @access  Private (Owner only)
export const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurant');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify owner
    if (order.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this order',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.status}`,
      });
    }

    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Order confirmed by restaurant',
    });

    await order.save();

    // Notify customer
    io.to(`order_${order._id}`).emit('order:status_update', {
      orderId: order._id,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming order',
      error: error.message,
    });
  }
};

// @desc    Assign rider to order (Owner)
// @route   PUT /api/orders/:id/assign-rider
// @access  Private (Owner only)
export const assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const order = await Order.findById(req.params.id).populate('restaurant');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to assign rider',
      });
    }

    // Verify rider exists and is available
    const rider = await User.findOne({
      _id: riderId,
      role: 'rider',
      availability: 'online',
      isActive: true,
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: 'Available rider not found',
      });
    }

    order.rider = riderId;
    order.status = 'assigned';
    order.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Rider ${rider.username} assigned`,
    });

    await order.save();

    // Notify customer and rider
    io.to(`order_${order._id}`).emit('order:status_update', {
      orderId: order._id,
      status: 'assigned',
      rider: {
        id: rider._id,
        username: rider.username,
        phone: rider.phone,
      },
      timestamp: new Date().toISOString(),
    });

    // Notify rider privately
    io.to(`user_${riderId}`).emit('order:assigned', {
      orderId: order._id,
      restaurant: order.restaurant.name,
      pickupAddress: order.restaurant.address.formattedAddress,
      deliveryAddress: order.deliveryAddress.formattedAddress,
      customerName: order.customer.username,
      totalAmount: order.totalAmount,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Assign rider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning rider',
      error: error.message,
    });
  }
};

// @desc    Update order status (Rider)
// @route   PUT /api/orders/:id/status
// @access  Private (Rider or Owner)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id).populate('restaurant');    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    const isRider = order.rider?.toString() === req.user._id.toString();
    const isOwner = order.restaurant.owner?.toString() === req.user._id.toString();

    if (!isRider && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update order status',
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['out_for_delivery', 'cancelled'],
      assigned: ['out_for_delivery', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled'],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.status} to ${status}`,
      });
    }

    // If rider is updating, only allow out_for_delivery and delivered
    if (isRider && !['out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
      return res.status(403).json({
        success: false,
        message: 'Rider can only update to out_for_delivery, delivered, or cancelled',
      });
    }

    // If delivering, update delivery time
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    await order.save();

    // Populate for response
    await order.populate('customer', 'username email phone');
    await order.populate('rider', 'username phone');
    await order.populate('restaurant', 'name');

    // Broadcast to all clients in the order room
    io.to(`order_${order._id}`).emit('order:status_update', {
      orderId: order._id,
      status,
      note,
      timestamp: new Date().toISOString(),
      updatedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

// @desc    Get available riders
// @route   GET /api/orders/available-riders
// @access  Private (Owner only)
export const getAvailableRiders = async (req, res) => {
  try {
    const riders = await User.find({
      role: 'rider',
      availability: 'online',
      isActive: true,
    }).select('username email phone availability createdAt');

    res.status(200).json({
      success: true,
      data: riders,
    });
  } catch (error) {
    console.error('Get available riders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available riders',
      error: error.message,
    });
  }
};