import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';

// @desc Get current user's cart
// @route GET /api/cart
// @access Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ 
      customer: req.user._id,
      isActive: true 
    })
      .populate({
        path: 'items.menuItem',
        populate: {
          path: 'restaurant',
          select: 'name logo',
        },
      })
      .populate('restaurant', 'name logo deliveryFee estimatedDeliveryTime');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalAmount: 0, restaurant: null },
      });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
    });
  }
};

// @desc Add item to cart
// @route POST /api/cart/items
// @access Private
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1, note } = req.body;

    const menuItem = await MenuItem.findById(menuItemId).populate('restaurant');
    if (!menuItem) return res.status(404).json({ success: false, message: 'Menu item not found' });
    if (!menuItem.isAvailable) return res.status(400).json({ success: false, message: 'Item unavailable' });

    const restaurant = menuItem.restaurant;
    if (!restaurant?.isOpen) return res.status(400).json({ success: false, message: 'Restaurant is closed' });

    let cart = await Cart.findOne({ customer: req.user._id, isActive: true });

    if (!cart) {
      cart = await Cart.create({
        customer: req.user._id,
        restaurant: restaurant._id,
        items: [],
      });
    }

    // Different restaurant check
    if (cart.restaurant?.toString() !== restaurant._id.toString() && cart.items.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart contains items from another restaurant. Clear cart first.',
      });
    }

    // Update restaurant if needed
    if (cart.items.length === 0) {
      cart.restaurant = restaurant._id;
    }

    // Check existing item
    const existingIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      if (note) cart.items[existingIndex].note = note;
    } else {
      cart.items.push({
        menuItem: menuItemId,
        quantity: Number(quantity),
        priceAtAdd: menuItem.price,
        note: note || '',
      });
    }

    await cart.save();

    // Populate response
    await cart.populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name logo' },
    });
    await cart.populate('restaurant', 'name logo deliveryFee estimatedDeliveryTime');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
  console.error("Add to cart error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    error: error.stack
         });
    }
};

// @desc Update cart item
// @route PUT /api/cart/items/:itemId
// @access Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity, note } = req.body;
    const cart = await Cart.findOne({ customer: req.user._id, isActive: true });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity !== undefined) {
      if (quantity < 1) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }
    if (note !== undefined) {
      cart.items[itemIndex].note = note;
    }

    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await cart.save();

    // Populate
    await cart.populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name logo' },
    });
    await cart.populate('restaurant', 'name logo deliveryFee estimatedDeliveryTime');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart item' });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/items/:itemId
// @access Private
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id, isActive: true });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await cart.save();

    await cart.populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name logo' },
    });
    await cart.populate('restaurant', 'name logo deliveryFee estimatedDeliveryTime');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Error removing item' });
  }
};

// @desc Clear entire cart
// @route DELETE /api/cart
// @access Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id, isActive: true });

    if (cart) {
      cart.items = [];
      cart.restaurant = null;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: { items: [], totalAmount: 0, restaurant: null },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
};