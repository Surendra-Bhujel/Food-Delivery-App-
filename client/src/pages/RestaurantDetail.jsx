import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import axios from "axios";

import Nav from "../components/Nav.jsx";
import FoodCard from "../components/FoodCard.jsx";
import { serverUrl } from "../App";
import { addToCart } from "../redux/cartSlice";

const RestaurantDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(`${serverUrl}/api/restaurants/${id}`);

        setRestaurant(response.data.data);
      } catch (err) {
        console.error(
          "Fetch restaurant error:",
          err.response?.data || err.message,
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleAddToCart = async (item, quantity) => {
    try {
      await dispatch(addToCart({ menuItemId: item._id, quantity })).unwrap();
    } catch (error) {
      console.error("Failed to add item to cart:", error);

      if (error?.conflict) {
        const confirmed = window.confirm(
          `${error.message}\n\nThis will remove existing items from your cart.`,
        );

        if (confirmed) {
          try {
            await dispatch(
              addToCart({
                menuItemId: item._id,
                quantity: quantity,
                replaceCart: true,
              }),
            ).unwrap();
          } catch (retryError) {
            console.error(
              "Failed to add item after conflict resolution:",
              retryError,
            );
            alert("Could not add item to cart. Please try again.");
          }
        }
      } else {
        alert(
          error?.message || "Could not add item to cart. Please try again.",
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center pt-[80px]">
          <p className="text-gray-500">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 pt-[80px]">
          <p className="text-gray-500">Restaurant not found.</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const menuByCategory = restaurant.menuByCategory || {};
  const categoryNames = Object.keys(menuByCategory);

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-[100px] sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 transition hover:text-[#ff4d2d]"
        >
          <IoMdArrowBack size={22} />
          <span>Back</span>
        </button>

        {/* Restaurant Header */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="h-56 w-full sm:h-72">
            <img
              src={
                restaurant.logo ||
                "https://via.placeholder.com/900x400?text=Restaurant"
              }
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                  {restaurant.name}
                </h1>

                <p className="mt-1 text-gray-500">
                  {restaurant.cuisineType?.join(", ")}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {restaurant.address?.formattedAddress}
                  {restaurant.address?.city && `, ${restaurant.address.city}`}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaStar className="h-4 w-4 text-yellow-500" />
                    {restaurant.rating || "New"}
                  </span>

                  <span className="flex items-center gap-1">
                    <MdAccessTime className="h-4 w-4" />
                    {restaurant.estimatedDeliveryTime || 30} min
                  </span>

                  <span>Rs. {restaurant.deliveryFee || 0} delivery fee</span>
                </div>
              </div>

              <span
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  restaurant.isOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* Menu by Category */}
        <div className="mt-8">
          <h2 className="mb-5 text-2xl font-bold text-gray-800">Menu</h2>

          {categoryNames.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <p className="text-gray-500">
                This restaurant hasn't added any menu items yet.
              </p>
            </div>
          ) : (
            categoryNames.map((categoryName) => (
              <div key={categoryName} className="mb-8">
                <h3 className="mb-4 text-lg font-bold text-gray-700">
                  {categoryName}
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {menuByCategory[categoryName].map((item) => (
                    <FoodCard
                      key={item._id}
                      data={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetail;
