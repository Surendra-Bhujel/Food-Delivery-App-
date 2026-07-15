import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Add menu item
// @route   POST /api/menu
// @access  Private (Owner only)
export const addMenuItem = async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isVegetarian,
      isVegan,
      isGlutenFree,
      spicyLevel,
      preparationTime,
      calories,
      nutritionalInfo,
    } = req.body;

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
        message: 'Not authorized to add items to this restaurant',
      });
    }

    const menuItem = await MenuItem.create({
      restaurant: restaurantId,
      name,
      description,
      price,
      category,
      image,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isGlutenFree: isGlutenFree || false,
      spicyLevel: spicyLevel || 'Medium',
      preparationTime: preparationTime || 15,
      calories,
      nutritionalInfo,
    });

    // Add menu item to restaurant's menu array
    restaurant.menu.push(menuItem._id);
    await restaurant.save();

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding menu item',
      error: error.message,
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Owner only)
export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    // Check if user owns the restaurant
    if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu item',
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message,
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Owner only)
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this menu item',
      });
    }

    // Remove from restaurant's menu array
    await Restaurant.findByIdAndUpdate(menuItem.restaurant._id, {
      $pull: { menu: menuItem._id },
    });

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message,
    });
  }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/menu/:id/toggle
// @access  Private (Owner only)
export const toggleMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to toggle this menu item',
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      data: {
        isAvailable: menuItem.isAvailable,
      },
    });
  } catch (error) {
    console.error('Toggle menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling menu item',
      error: error.message,
    });
  }
};

// @desc    Get menu items for a restaurant
// @route   GET /api/menu/restaurant/:restaurantId
// @access  Public
export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category, isAvailable = true } = req.query;

    const query = { restaurant: restaurantId };

    if (category) {
      query.category = category;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    // Group by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedMenu,
      total: menuItems.length,
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message,
    });
  }
};