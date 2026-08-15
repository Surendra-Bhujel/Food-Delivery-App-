import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaUtensils, FaLeaf, FaPepperHot, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { serverUrl } from "../App";
import { setRestaurant } from "../redux/ownerSlice";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { restaurant } = useSelector((state) => state.owner);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Main Course");

  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);

  const [spicyLevel, setSpicyLevel] = useState("Medium");
  const [preparationTime, setPreparationTime] = useState(15);

  const [loading, setLoading] = useState(false);

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff9f6]">
        <div className="text-center">
          <FaUtensils size={50} className="mx-auto mb-4 text-[#ff4d2d]" />

          <h2 className="text-xl font-bold text-gray-800">
            Restaurant not found
          </h2>

          <p className="mt-2 text-gray-500">
            Please create your restaurant first.
          </p>

          <button
            onClick={() => navigate("/owner-dashboard")}
            className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${serverUrl}/api/menu`,
        {
          restaurantId: restaurant._id,
          name,
          description,
          price: Number(price),
          category,
          isAvailable: true,
          isVegetarian,
          isVegan,
          isGlutenFree: false,
          spicyLevel,
          preparationTime: Number(preparationTime),
        },
        {
          withCredentials: true,
        },
      );

      // Add newly created item to Redux restaurant
      const newMenuItem = response.data.data;

      dispatch(
        setRestaurant({
          ...restaurant,
          menu: [...(restaurant.menu || []), newMenuItem],
        }),
      );

      alert("Menu item added successfully!");

      navigate("/owner-dashboard");
    } catch (error) {
      console.error(
        "Add menu item error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong while adding the menu item.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 py-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/owner-dashboard")}
        className="absolute left-5 top-5 cursor-pointer"
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </button>

      <div className="mx-auto mt-14 w-full max-w-lg rounded-2xl border border-orange-100 bg-white p-6 shadow-xl sm:p-8">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <FaUtensils size={35} className="text-[#ff4d2d]" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Add Menu Item
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a delicious item to your restaurant menu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Item Name *
            </label>

            <input
              type="text"
              placeholder="e.g. Chicken Burger"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              placeholder="Tell customers about this item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full resize-none rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price *
            </label>

            <input
              type="number"
              placeholder="e.g. 350"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category *
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Main Course">Main Course</option>
              <option value="Burger">Burger</option>
              <option value="Pizza">Pizza</option>
              <option value="Momo">Momo</option>
              <option value="Noodles">Noodles</option>
              <option value="Rice">Rice</option>
              <option value="Snacks">Snacks</option>
              <option value="Drinks">Drinks</option>
              <option value="Dessert">Dessert</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Vegetarian / Vegan */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="h-4 w-4"
              />

              <FaLeaf className="text-green-600" />

              <span className="text-sm font-medium">Vegetarian</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
              <input
                type="checkbox"
                checked={isVegan}
                onChange={(e) => setIsVegan(e.target.checked)}
                className="h-4 w-4"
              />

              <FaLeaf className="text-green-600" />

              <span className="text-sm font-medium">Vegan</span>
            </label>
          </div>

          {/* Spicy level */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaPepperHot className="text-red-500" />
              Spicy Level
            </label>

            <select
              value={spicyLevel}
              onChange={(e) => setSpicyLevel(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
              <option value="Extra Hot">Extra Hot</option>
            </select>
          </div>

          {/* Preparation time */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaClock className="text-[#ff4d2d]" />
              Preparation Time
            </label>

            <input
              type="number"
              min="1"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <p className="mt-1 text-xs text-gray-500">Time in minutes</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ff4d2d] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding Item..." : "Add Menu Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
