import Order from '../models/Order.js';
import RiderLocation from '../models/RiderLocation.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join order tracking room
    socket.on('join_order_room', async ({ orderId, role, userId }) => {
      try {
        const order = await Order.findById(orderId)
          .populate('customer', 'username email')
          .populate('restaurant', 'name');

        if (!order) {
          socket.emit('error', { message: 'Order not found' });
          return;
        }

        // Verify user has access to this order
        const hasAccess = 
          (role === 'customer' && order.customer._id.toString() === userId) ||
          (role === 'rider' && order.rider?.toString() === userId) ||
          (role === 'owner' && order.restaurant.owner?.toString() === userId);

        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to this order' });
          return;
        }

        socket.join(`order_${orderId}`);
        console.log(`📡 ${role} ${userId} joined order room: ${orderId}`);

        // Send current order status
        socket.emit('order:status_update', {
          orderId,
          status: order.status,
          timestamp: new Date().toISOString(),
        });

        // If there's a rider, send their last known location
        if (order.rider) {
          const lastLocation = await RiderLocation.findOne({
            order: orderId,
            rider: order.rider,
          }).sort({ timestamp: -1 });

          if (lastLocation) {
            socket.emit('rider:location', {
              orderId,
              coordinates: lastLocation.location.coordinates,
              timestamp: lastLocation.timestamp,
            });
          }
        }
      } catch (error) {
        console.error('Error joining order room:', error);
        socket.emit('error', { message: 'Error joining order room' });
      }
    });

    // Rider location updates
    socket.on('rider:location', async (data) => {
      try {
        const { orderId, coordinates, accuracy, speed, heading } = data;

        if (!orderId || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
          socket.emit('error', { message: 'Invalid location data' });
          return;
        }

        // Validate order and rider
        const order = await Order.findById(orderId);
        if (!order) {
          socket.emit('error', { message: 'Order not found' });
          return;
        }

        // Verify this is the assigned rider
        if (order.rider?.toString() !== socket.userId) {
          socket.emit('error', { message: 'Not authorized to update this order location' });
          return;
        }

        // Save location to database
        const riderLocation = await RiderLocation.create({
          rider: socket.userId,
          order: orderId,
          location: {
            type: 'Point',
            coordinates: coordinates,
          },
          accuracy,
          speed,
          heading,
          timestamp: new Date(),
        });

        // Broadcast to all clients in the order room
        io.to(`order_${orderId}`).emit('rider:location', {
          orderId,
          coordinates,
          accuracy,
          speed,
          heading,
          timestamp: new Date().toISOString(),
        });

        console.log(`📍 Rider ${socket.userId} updated location for order ${orderId}`);
      } catch (error) {
        console.error('Error updating rider location:', error);
        socket.emit('error', { message: 'Error updating location' });
      }
    });

    // Order status update (from owner or rider)
    socket.on('order:status_update', async (data) => {
      try {
        const { orderId, status, note } = data;

        if (!orderId || !status) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        const order = await Order.findById(orderId)
          .populate('customer', 'username email')
          .populate('restaurant', 'name')
          .populate('rider', 'username');

        if (!order) {
          socket.emit('error', { message: 'Order not found' });
          return;
        }

        // Verify user has permission to update status
        const isOwner = order.restaurant.owner?.toString() === socket.userId;
        const isRider = order.rider?._id?.toString() === socket.userId;

        if (!isOwner && !isRider) {
          socket.emit('error', { message: 'Not authorized to update order status' });
          return;
        }

        // Update order status
        order.status = status;
        if (note) {
          order.statusHistory.push({
            status,
            timestamp: new Date(),
            note,
          });
        } else {
          order.statusHistory.push({
            status,
            timestamp: new Date(),
          });
        }

        await order.save();

        // Broadcast to all clients in the order room
        io.to(`order_${orderId}`).emit('order:status_update', {
          orderId,
          status,
          note,
          timestamp: new Date().toISOString(),
          updatedBy: socket.userId,
        });

        console.log(`📢 Order ${orderId} status updated to: ${status}`);
      } catch (error) {
        console.error('Error updating order status:', error);
        socket.emit('error', { message: 'Error updating order status' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

// Authentication for socket connections
export const socketAuth = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });
};