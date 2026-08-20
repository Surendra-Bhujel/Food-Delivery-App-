import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import axios from "axios";

import Nav from "../components/Nav.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import FoodCard from "../components/FoodCard.jsx";
import { serverUrl } from "../App";
import { categories } from "../category";
import { addToCart, clearConflict } from "../redux/cartSlice";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCity } = useSelector((state) => state.user);

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(`${serverUrl}/api/restaurants`);

        setRestaurants(response.data.data || []);
      } catch (err) {
        console.error(
          "Fetch restaurants error:",
          err.response?.data || err.message,
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const getRestaurantImage = (restaurant) =>
    restaurant.logo || "https://via.placeholder.com/400x250?text=Restaurant";

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Restaurants matching category + search (by name, cuisine, or any menu item name)
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCategory = selectedCategory
      ? r.cuisineType?.some(
          (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
        )
      : true;

    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const nameMatch = r.name?.toLowerCase().includes(normalizedQuery);
    const cuisineMatch = r.cuisineType?.some((c) =>
      c.toLowerCase().includes(normalizedQuery),
    );
    const menuMatch = (r.menu || []).some((item) =>
      item.name?.toLowerCase().includes(normalizedQuery),
    );

    return nameMatch || cuisineMatch || menuMatch;
  });

  // Flatten every restaurant's populated menu into a single list of dishes,
  // attaching restaurant info to each item so FoodCard can show/link to it.
  const suggestedItems = useMemo(() => {
    const allItems = restaurants.flatMap((restaurant) =>
      (restaurant.menu || [])
        .filter((item) => item.isAvailable)
        .map((item) => ({
          ...item,
          restaurant: {
            _id: restaurant._id,
            name: restaurant.name,
          },
        })),
    );

    const shuffled = [...allItems].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 8);
  }, [restaurants]);

  // Dishes matching the search query, across all restaurants
  const matchingDishes = useMemo(() => {
    if (!normalizedQuery) return [];

    return restaurants.flatMap((restaurant) =>
      (restaurant.menu || [])
        .filter(
          (item) =>
            item.isAvailable &&
            item.name?.toLowerCase().includes(normalizedQuery),
        )
        .map((item) => ({
          ...item,
          restaurant: {
            _id: restaurant._id,
            name: restaurant.name,
          },
        })),
    );
  }, [restaurants, normalizedQuery]);

  const handleAddToCart = async (item, quantity) => {
    const result = await dispatch(
      addToCart({ menuItemId: item._id, quantity }),
    );

    if (addToCart.rejected.match(result) && result.payload?.conflict) {
      const confirmed = window.confirm(
        `${result.payload.message}\n\nThis will remove existing items from your cart.`,
      );

      if (confirmed) {
        await dispatch(
          addToCart({
            menuItemId: result.payload.menuItemId || item._id,
            quantity: result.payload.quantity || quantity,
            replaceCart: true,
          }),
        );
      }

      dispatch(clearConflict());
    } else if (addToCart.rejected.match(result)) {
      // Non-conflict errors
      console.error(
        "Failed to add item to cart:",
        result.payload || result.error,
      );
      alert(
        result.payload?.message ||
          "Could not add item to cart. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-[100px] sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            {currentCity
              ? `Restaurants near ${currentCity}`
              : "Discover Restaurants"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Order food from your favorite local restaurants.
          </p>
        </div>

        {/* If searching, show matching dishes first */}
        {normalizedQuery && (
          <div className="mb-10">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              {matchingDishes.length > 0
                ? `Dishes matching "${searchQuery}"`
                : `No dishes found for "${searchQuery}"`}
            </h2>

            {matchingDishes.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchingDishes.map((item) => (
                  <div
                    key={item._id}
                    onClick={() =>
                      navigate(`/restaurant/${item.restaurant._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <FoodCard data={item} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        {!normalizedQuery && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              What's on your mind?
            </h2>

            <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex flex-shrink-0 flex-col items-center gap-2 group"
              >
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 bg-white shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:h-28 sm:w-28 ${
                    selectedCategory === null
                      ? "border-[#ff4d2d] shadow-lg shadow-[#ff4d2d]/20"
                      : "border-transparent"
                  }`}
                >
                  <span className="text-3xl">🍽️</span>
                </div>

                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    selectedCategory === null
                      ? "text-[#ff4d2d]"
                      : "text-gray-700"
                  }`}
                >
                  All
                </span>
              </button>

              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Food Items */}
        {!normalizedQuery &&
          !loading &&
          !error &&
          suggestedItems.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-5 text-2xl font-bold text-gray-800">
                Suggested for you
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {suggestedItems.map((item) => (
                  <div key={item._id} className="w-64 flex-shrink-0">
                    <div
                      onClick={() =>
                        navigate(`/restaurant/${item.restaurant._id}`)
                      }
                      className="cursor-pointer"
                    >
                      <FoodCard data={item} onAddToCart={handleAddToCart} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Restaurant Grid */}
        <div>
          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            {normalizedQuery
              ? `Restaurants matching "${searchQuery}"`
              : selectedCategory
                ? `${selectedCategory} Restaurants`
                : "All Restaurants"}
          </h2>

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <p className="text-gray-500">Loading restaurants...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <p className="text-gray-500">
                Something went wrong loading restaurants. Please try again.
              </p>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                No restaurants found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {normalizedQuery
                  ? `No restaurants matching "${searchQuery}".`
                  : selectedCategory
                    ? `No restaurants serving ${selectedCategory} right now.`
                    : "Check back soon for restaurants in your area."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={getRestaurantImage(restaurant)}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {restaurant.name}
                      </h3>

                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          restaurant.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {restaurant.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.cuisineType?.join(", ") ||
                        "Cuisine not specified"}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaStar className="h-3 w-3 text-yellow-500" />
                        {restaurant.rating || "New"}
                      </span>

                      <span className="flex items-center gap-1">
                        <MdAccessTime className="h-3 w-3" />
                        {restaurant.estimatedDeliveryTime || 30} min
                      </span>

                      <span>Rs. {restaurant.deliveryFee || 0} delivery</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
