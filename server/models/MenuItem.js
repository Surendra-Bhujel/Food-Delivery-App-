import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Food+Item",
    },

    foodType: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Other"],
      default: "Other",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    spicyLevel: {
      type: String,
      enum: ["Mild", "Medium", "Hot", "Extra Hot"],
      default: "Medium",
    },

    preparationTime: {
      type: Number,
      default: 15,
      min: 1,
    },

    calories: {
      type: Number,
      min: 0,
    },

    nutritionalInfo: {
      protein: Number,
      carbs: Number,
      fat: Number,
    },

    includedItems: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },

        quantity: Number,
      },
    ],
  },

  {
    timestamps: true,
  },
);

menuItemSchema.index({
  restaurant: 1,
  category: 1,
});

menuItemSchema.index({
  name: "text",
  description: "text",
});

export default mongoose.model("MenuItem", menuItemSchema);
