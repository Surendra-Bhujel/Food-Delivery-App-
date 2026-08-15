import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";

// CREATE RESTAURANT
// POST /api/restaurants
// Private - Owner

export const createRestaurant = async (req, res) => {
  try {
    console.log("Restaurant body:", req.body);
    console.log("Restaurant file:", req.file);

    const {
      name,
      description,
      cuisineType,
      city,
      state,
      address,
      latitude,
      longitude,
      phone,
      email,
      website,
      open,
      close,
      deliveryFee,
      estimatedDeliveryTime,
      minOrderAmount,
    } = req.body;

    // Check if owner already has a restaurant
    const existingRestaurant = await Restaurant.findOne({
      owner: req.user._id,
    });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "You already own a restaurant",
      });
    }

    // Required fields
    if (!name || !city || !state || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, city, state and address are required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Convert latitude and longitude to numbers
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
    }

    // Convert cuisineType into an array
    let parsedCuisineType = cuisineType;

    if (typeof cuisineType === "string") {
      try {
        parsedCuisineType = JSON.parse(cuisineType);
      } catch {
        parsedCuisineType = [cuisineType];
      }
    }

    if (!Array.isArray(parsedCuisineType) || parsedCuisineType.length === 0) {
      parsedCuisineType = ["Other"];
    }

    // Restaurant image
    let logo = "https://via.placeholder.com/200x200?text=Restaurant";

    if (req.file) {
      logo = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Create restaurant
    const restaurant = await Restaurant.create({
      owner: req.user._id,

      name,

      description,

      cuisineType: parsedCuisineType,

      address: {
        type: "Point",

        coordinates: [parsedLongitude, parsedLatitude],

        formattedAddress: address,

        city,

        state,
      },

      contact: {
        phone,
        email,
        website,
      },

      operatingHours: {
        open: open || "10:00",
        close: close || "22:00",
      },

      deliveryFee: Number(deliveryFee) || 0,

      estimatedDeliveryTime: Number(estimatedDeliveryTime) || 30,

      minOrderAmount: Number(minOrderAmount) || 0,

      logo,
    });

    // Save restaurant ID in User
    await User.findByIdAndUpdate(req.user._id, {
      restaurantId: restaurant._id,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating restaurant",
      error: error.message,
    });
  }
};

// GET ALL RESTAURANTS
// GET /api/restaurants
// Public

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
      radius = 10,
      isOpen = true,
    } = req.query;

    const query = {
      isOpen: isOpen === "false" ? false : true,
    };

    // Search by name / description / cuisine
    if (search) {
      query.$text = {
        $search: search,
      };
    }

    // Cuisine filter
    if (cuisine) {
      query.cuisineType = {
        $in: cuisine.split(","),
      };
    }

    // Rating filter
    if (rating) {
      query.rating = {
        $gte: parseFloat(rating),
      };
    }

    // Delivery time filter
    if (deliveryTime) {
      query.estimatedDeliveryTime = {
        $lte: parseInt(deliveryTime),
      };
    }

    // Nearby restaurant search
    if (latitude && longitude) {
      const parsedLatitude = parseFloat(latitude);

      const parsedLongitude = parseFloat(longitude);

      if (!Number.isNaN(parsedLatitude) && !Number.isNaN(parsedLongitude)) {
        query["address.coordinates"] = {
          $nearSphere: {
            $geometry: {
              type: "Point",

              coordinates: [parsedLongitude, parsedLatitude],
            },

            $maxDistance: parseFloat(radius) * 1000,
          },
        };
      }
    }

    const currentPage = parseInt(page);

    const currentLimit = parseInt(limit);

    const skip = (currentPage - 1) * currentLimit;

    const restaurants = await Restaurant.find(query)
      .populate("owner", "username email")
      .populate("menu", "name price image category isAvailable")
      .sort({
        rating: -1,
      })
      .skip(skip)
      .limit(currentLimit);

    const total = await Restaurant.countDocuments(query);

    return res.status(200).json({
      success: true,

      data: restaurants,

      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        pages: Math.ceil(total / currentLimit),
      },
    });
  } catch (error) {
    console.error("Get restaurants error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
      error: error.message,
    });
  }
};

// GET RESTAURANT BY ID
// GET /api/restaurants/:id
// Public

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("owner", "username email phone")
      .populate({
        path: "menu",

        match: {
          isAvailable: true,
        },

        options: {
          sort: {
            category: 1,
          },
        },
      });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
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

    return res.status(200).json({
      success: true,

      data: {
        ...restaurant.toObject(),

        menuByCategory,
      },
    });
  } catch (error) {
    console.error("Get restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching restaurant",
      error: error.message,
    });
  }
};

// UPDATE RESTAURANT
// PUT /api/restaurants/:id
// Private - Owner

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check owner
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this restaurant",
      });
    }

    const {
      name,
      description,
      cuisineType,
      city,
      state,
      address,
      latitude,
      longitude,
      phone,
      email,
      website,
      open,
      close,
      deliveryFee,
      estimatedDeliveryTime,
      minOrderAmount,
    } = req.body;

    // Update basic information
    if (name !== undefined) {
      restaurant.name = name;
    }

    if (description !== undefined) {
      restaurant.description = description;
    }

    // Update cuisine
    if (cuisineType !== undefined) {
      let parsedCuisineType = cuisineType;

      if (typeof cuisineType === "string") {
        try {
          parsedCuisineType = JSON.parse(cuisineType);
        } catch {
          parsedCuisineType = [cuisineType];
        }
      }

      if (Array.isArray(parsedCuisineType) && parsedCuisineType.length > 0) {
        restaurant.cuisineType = parsedCuisineType;
      }
    }

    // UPDATE ADDRESS

    if (
      city !== undefined ||
      state !== undefined ||
      address !== undefined ||
      latitude !== undefined ||
      longitude !== undefined
    ) {
      const currentCoordinates = restaurant.address?.coordinates || [0, 0];

      const newLongitude =
        longitude !== undefined ? parseFloat(longitude) : currentCoordinates[0];

      const newLatitude =
        latitude !== undefined ? parseFloat(latitude) : currentCoordinates[1];

      restaurant.address = {
        type: "Point",

        coordinates: [newLongitude, newLatitude],

        formattedAddress:
          address !== undefined
            ? address
            : restaurant.address?.formattedAddress,

        city: city !== undefined ? city : restaurant.address?.city,

        state: state !== undefined ? state : restaurant.address?.state,

        zipCode: restaurant.address?.zipCode,
      };
    }

    // UPDATE CONTACT

    if (phone !== undefined || email !== undefined || website !== undefined) {
      restaurant.contact = {
        phone: phone !== undefined ? phone : restaurant.contact?.phone,

        email: email !== undefined ? email : restaurant.contact?.email,

        website: website !== undefined ? website : restaurant.contact?.website,
      };
    }

    // UPDATE OPERATING HOURS

    if (open !== undefined || close !== undefined) {
      restaurant.operatingHours = {
        open: open !== undefined ? open : restaurant.operatingHours?.open,

        close: close !== undefined ? close : restaurant.operatingHours?.close,

        daysOpen: restaurant.operatingHours?.daysOpen,
      };
    }

    // UPDATE OTHER FIELDS

    if (deliveryFee !== undefined) {
      restaurant.deliveryFee = Number(deliveryFee);
    }

    if (estimatedDeliveryTime !== undefined) {
      restaurant.estimatedDeliveryTime = Number(estimatedDeliveryTime);
    }

    if (minOrderAmount !== undefined) {
      restaurant.minOrderAmount = Number(minOrderAmount);
    }

    // UPDATE IMAGE

    if (req.file) {
      restaurant.logo = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Save
    const updatedRestaurant = await restaurant.save();

    return res.status(200).json({
      success: true,

      message: "Restaurant updated successfully",

      data: updatedRestaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    return res.status(500).json({
      success: false,

      message: "Error updating restaurant",

      error: error.message,
    });
  }
};

// TOGGLE RESTAURANT OPEN / CLOSE
// PATCH /api/restaurants/:id/toggle
// Private - Owner

export const toggleRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check owner
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to toggle this restaurant",
      });
    }

    restaurant.isOpen = !restaurant.isOpen;

    await restaurant.save();

    return res.status(200).json({
      success: true,

      message: "Restaurant status updated",

      data: {
        isOpen: restaurant.isOpen,
      },
    });
  } catch (error) {
    console.error("Toggle restaurant error:", error);

    return res.status(500).json({
      success: false,

      message: "Error toggling restaurant",

      error: error.message,
    });
  }
};

// GET MY RESTAURANT
// GET /api/restaurants/my-restaurant
// Private - Owner

export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user._id,
    }).populate("menu");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: restaurant,
    });
  } catch (error) {
    console.error("Get my restaurant error:", error);

    return res.status(500).json({
      success: false,

      message: "Error fetching restaurant",

      error: error.message,
    });
  }
};
