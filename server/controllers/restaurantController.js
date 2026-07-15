import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private (Owner only)
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisineType,
      address,
      contact,
      operatingHours,
      deliveryFee,
      estimatedDeliveryTime,
      minOrderAmount,
    } = req.body;

    // Check if user already owns a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user._id });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'You already own a restaurant',
      });
    }

    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      description,
      cuisineType,
      address,
      contact,
      operatingHours,
      deliveryFee: deliveryFee || 0,
      estimatedDeliveryTime: estimatedDeliveryTime || 30,
      minOrderAmount: minOrderAmount || 0,
    });

    // Update user with restaurant reference
    await User.findByIdAndUpdate(req.user._id, {
      restaurantId: restaurant._id,
    });

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating restaurant',
      error: error.message,
    });
  }
};

// @desc    Get all restaurants with filters
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      cuisine,
      search,
      rating,
      deliveryTime,
      latitude,
      longitude,
      radius = 10, // km
      isOpen = true,
    } = req.query;

    const query = { isOpen };

    // Search by name or cuisine
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by cuisine type
    if (cuisine) {
      query.cuisineType = { $in: cuisine.split(',') };
    }

    // Filter by minimum rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Filter by maximum delivery time
    if (deliveryTime) {
      query.estimatedDeliveryTime = { $lte: parseInt(deliveryTime) };
    }

    // Geospatial query for nearby restaurants
    if (latitude && longitude) {
      query['address.coordinates'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'username email')
      .populate('menu', 'name price image category isAvailable')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants',
      error: error.message,
    });
  }
};

// @desc    Get single restaurant with menu
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'username email phone')
      .populate({
        path: 'menu',
        match: { isAvailable: true },
        options: { sort: { category: 1 } },
      });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Group menu items by category
    const menuByCategory = restaurant.menu.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        menuByCategory,
      },
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant',
      error: error.message,
    });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Owner only)
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Check if user is the owner
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant',
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedRestaurant,
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating restaurant',
      error: error.message,
    });
  }
};

// @desc    Toggle restaurant open/close
// @route   PATCH /api/restaurants/:id/toggle
// @access  Private (Owner only)
export const toggleRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to toggle this restaurant',
      });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      data: {
        isOpen: restaurant.isOpen,
      },
    });
  } catch (error) {
    console.error('Toggle restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling restaurant',
      error: error.message,
    });
  }
};