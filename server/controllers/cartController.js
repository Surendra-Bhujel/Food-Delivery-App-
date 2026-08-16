import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";

// GET CART
// GET /api/cart
// Private - Customer
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.user._id,
      isActive: true,
    }).populate({
      path: "items.menuItem",
      select: "name price image category isAvailable",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
          restaurant: null,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// ADD TO CART
// POST /api/cart/items
// Private - Customer
export const addToCart = async (req, res) => {
  try {
    const {
      menuItemId,
      quantity = 1,
      note = "",
      replaceCart = false,
    } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        message: "Menu item ID is required",
      });
    }

    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This item is currently unavailable",
      });
    }

    let cart = await Cart.findOne({
      customer: req.user._id,
      isActive: true,
    });

    // No cart yet — create one
    if (!cart) {
      cart = await Cart.create({
        customer: req.user._id,
        restaurant: menuItem.restaurant,
        items: [
          {
            menuItem: menuItem._id,
            quantity,
            note,
            priceAtAdd: menuItem.price,
          },
        ],
      });
    } else {
      // Cart exists but has items from a different restaurant
      if (
        cart.items.length > 0 &&
        cart.restaurant.toString() !== menuItem.restaurant.toString()
      ) {
        if (!replaceCart) {
          return res.status(409).json({
            success: false,
            conflict: true,
            message:
              "Your cart contains items from another restaurant. Clear it to add items from this restaurant?",
          });
        }

        // User confirmed — clear old items, switch restaurant
        cart.items = [];
        cart.restaurant = menuItem.restaurant;
      }

      // Item already in cart -> bump quantity
      const existingItem = cart.items.find(
        (item) => item.menuItem.toString() === menuItemId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;

        if (note) {
          existingItem.note = note;
        }
      } else {
        cart.items.push({
          menuItem: menuItem._id,
          quantity,
          note,
          priceAtAdd: menuItem.price,
        });

        cart.restaurant = menuItem.restaurant;
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.menuItem",
      select: "name price image category isAvailable",
    });

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

// UPDATE CART ITEM QUANTITY
// PUT /api/cart/items/:itemId
// Private - Customer
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      customer: req.user._id,
      isActive: true,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.menuItem",
      select: "name price image category isAvailable",
    });

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message,
    });
  }
};

// REMOVE CART ITEM
// DELETE /api/cart/items/:itemId
// Private - Customer
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.user._id,
      isActive: true,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId,
    );

    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.menuItem",
      select: "name price image category isAvailable",
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Error removing cart item",
      error: error.message,
    });
  }
};

// CLEAR CART
// DELETE /api/cart
// Private - Customer
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.user._id,
      isActive: true,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
        data: {
          items: [],
          totalAmount: 0,
          restaurant: null,
        },
      });
    }

    cart.items = [];
    cart.restaurant = null;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};
