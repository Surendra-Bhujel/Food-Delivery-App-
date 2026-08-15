import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { serverUrl } from "../App";

const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { restaurant } = useSelector((state) => state.owner);

  const existingItem = restaurant?.menu?.find((item) => item._id === id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [foodType, setFoodType] = useState("Other");
  const [spicyLevel, setSpicyLevel] = useState("Medium");

  const [preparationTime, setPreparationTime] = useState("15");
  const [calories, setCalories] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Pre-fill form once existingItem is available
  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name || "");
      setDescription(existingItem.description || "");
      setPrice(existingItem.price ?? "");
      setCategory(existingItem.category || "");
      setFoodType(existingItem.foodType || "Other");
      setSpicyLevel(existingItem.spicyLevel || "Medium");
      setPreparationTime(
        existingItem.preparationTime != null
          ? String(existingItem.preparationTime)
          : "15",
      );
      setCalories(
        existingItem.calories != null ? String(existingItem.calories) : "",
      );
      setIsAvailable(
        existingItem.isAvailable != null ? existingItem.isAvailable : true,
      );

      if (existingItem.image) {
        setImagePreview(existingItem.image);
      }

      setInitializing(false);
    } else if (restaurant) {
      // Restaurant loaded but no matching item found
      setInitializing(false);
    }
  }, [existingItem, restaurant]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restaurant?._id) {
      alert("Restaurant not found.");
      return;
    }

    if (!name.trim() || !price || !category) {
      alert("Please fill in item name, price and category.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("restaurantId", restaurant._id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("spicyLevel", spicyLevel);
      formData.append("preparationTime", preparationTime);
      formData.append("isAvailable", isAvailable);

      if (calories) {
        formData.append("calories", calories);
      }

      // Only append image if a new one was picked;
      // otherwise the backend keeps the existing image.
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${serverUrl}/api/menu/${id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      console.log("Menu item updated:", response.data);

      alert("Menu item updated successfully.");

      navigate("/owner-dashboard");
    } catch (error) {
      console.error(
        "Edit menu item error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update menu item.");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Restaurant not found
          </h2>

          <p className="mt-2 text-gray-500">
            Please create your restaurant before editing menu items.
          </p>

          <button
            onClick={() => navigate("/owner-dashboard")}
            className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!initializing && !existingItem) {
    return (
      <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Menu item not found
          </h2>

          <p className="mt-2 text-gray-500">
            This item may have been deleted or doesn't belong to this
            restaurant.
          </p>

          <button
            onClick={() => navigate("/owner-dashboard")}
            className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f6] px-4 py-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/owner-dashboard")}
        className="mb-6 flex items-center gap-2 text-gray-700 transition hover:text-[#ff4d2d]"
      >
        <IoMdArrowBack size={24} />
        <span>Back to Dashboard</span>
      </button>

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Menu Item</h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the details of this food or drink item.
          </p>
        </div>

        {/* Restaurant information */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-4">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
            )}

            <div>
              <h2 className="font-semibold text-gray-900">{restaurant.name}</h2>

              <p className="text-sm text-gray-500">
                {restaurant.address?.formattedAddress}
              </p>

              <p className="text-sm text-gray-500">
                {restaurant.address?.city}, {restaurant.address?.state}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Item Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Burger"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the food item"
              rows="4"
              maxLength="500"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
            />

            <p className="mt-1 text-xs text-gray-400">
              Maximum 500 characters.
            </p>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 350"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
                required
              >
                <option value="">Select category</option>

                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Rice & Biryani">Rice & Biryani</option>
                <option value="Noodles & Pasta">Noodles & Pasta</option>
                <option value="Bread">Bread</option>
                <option value="Curry">Curry</option>
                <option value="Salads">Salads</option>
                <option value="Soups">Soups</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Combos">Combos</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Food Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Food Type
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setFoodType("Vegetarian")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  foodType === "Vegetarian"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Vegetarian
              </button>

              <button
                type="button"
                onClick={() => setFoodType("Non-Vegetarian")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  foodType === "Non-Vegetarian"
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Non-Vegetarian
              </button>

              <button
                type="button"
                onClick={() => setFoodType("Other")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  foodType === "Other"
                    ? "border-gray-600 bg-gray-100 text-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Other
              </button>
            </div>
          </div>

          {/* Spicy Level */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Spicy Level
            </label>

            <select
              value={spicyLevel}
              onChange={(e) => setSpicyLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
            >
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
              <option value="Extra Hot">Extra Hot</option>
            </select>
          </div>

          {/* Preparation time + Calories */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preparation Time
              </label>

              <input
                type="number"
                min="1"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
              />

              <p className="mt-1 text-xs text-gray-400">Time in minutes.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Calories
              </label>

              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Availability
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsAvailable(true)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  isAvailable
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Available
              </button>

              <button
                type="button"
                onClick={() => setIsAvailable(false)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  !isAvailable
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Unavailable
              </button>
            </div>
          </div>

          {/* Food Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Food Image
            </label>

            <div className="rounded-xl border border-dashed border-gray-300 p-4">
              {imagePreview ? (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="h-56 w-full rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-gray-50 text-center">
                  <div>
                    <p className="text-gray-500">No image selected</p>

                    <p className="mt-1 text-xs text-gray-400">
                      JPG, JPEG, PNG or WEBP
                    </p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer text-sm text-gray-600"
              />

              <p className="mt-2 text-xs text-gray-400">
                Leave empty to keep the current image. Maximum file size:
                5MB.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ff4d2d] px-5 py-3 font-semibold text-white transition hover:bg-[#e63e1f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating Item..." : "Update Menu Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;