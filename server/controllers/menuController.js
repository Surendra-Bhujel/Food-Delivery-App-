import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// Add Menu Item
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

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add items to this restaurant",
      });
    }

    const menuItem = await MenuItem.create({
      restaurant: restaurant._id,
      name,
      description,
      price: Number(price),
      category,
      image,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isVegetarian: Boolean(isVegetarian),
      isVegan: Boolean(isVegan),
      isGlutenFree: Boolean(isGlutenFree),
      spicyLevel: spicyLevel || "Medium",
      preparationTime: Number(preparationTime) || 15,
      calories,
      nutritionalInfo,
    });

    restaurant.menu.push(menuItem._id);

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Add menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Error adding menu item",
      error: error.message,
    });
  }
};

// Update Menu Item
export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      "restaurant",
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this menu item",
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Error updating menu item",
      error: error.message,
    });
  }
};

// Delete Menu Item
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      "restaurant",
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this menu item",
      });
    }

    await Restaurant.findByIdAndUpdate(menuItem.restaurant._id, {
      $pull: {
        menu: menuItem._id,
      },
    });

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
      error: error.message,
    });
  }
};

// Toggle Menu Item
export const toggleMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      "restaurant",
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this menu item",
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;

    await menuItem.save();

    res.status(200).json({
      success: true,
      message: "Availability updated",
      data: {
        isAvailable: menuItem.isAvailable,
      },
    });
  } catch (error) {
    console.error("Toggle menu item error:", error);

    res.status(500).json({
      success: false,
      message: "Error toggling menu item",
      error: error.message,
    });
  }
};

// Get Menu By Restaurant
export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const { category, isAvailable } = req.query;

    const query = {
      restaurant: restaurantId,
    };

    if (category) {
      query.category = category;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === "true";
    }

    const menuItems = await MenuItem.find(query).sort({
      category: 1,
      name: 1,
    });

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
    console.error("Get menu error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
      error: error.message,
    });
  }
};
