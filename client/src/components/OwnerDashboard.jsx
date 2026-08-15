import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaPlus, FaPen } from "react-icons/fa";

import Nav from "../components/Nav.jsx";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const { restaurant } = useSelector((state) => state.owner);

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      {!restaurant ? (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
              <FaUtensils size={40} className="text-[#ff4d2d]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Add Your Restaurant
            </h2>

            <p className="mt-3 text-gray-500">
              Set up your restaurant first before adding items to your menu.
            </p>

            <button
              onClick={() => navigate("/create-restaurant")}
              className="mt-6 rounded-lg bg-[#ff4d2d] px-6 py-3 font-semibold text-white"
            >
              Create Restaurant
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24">
          {/* Restaurant Header */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="relative h-56">
              <img
                src={
                  restaurant.logo ||
                  "https://via.placeholder.com/800x400?text=Restaurant"
                }
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute bottom-5 left-5 text-white">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>

                <p className="mt-1">
                  {restaurant.address?.city}, {restaurant.address?.state}
                </p>
              </div>
            </div>

            {/* Restaurant Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm text-gray-500">Cuisine</p>

                <p className="font-semibold text-gray-800">
                  {restaurant.cuisineType?.join(", ")}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/create-restaurant")}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                >
                  <FaPen size={13} />
                  Edit Restaurant
                </button>

                <button
                  onClick={() => navigate("/add-menu-item")}
                  className="flex items-center gap-2 rounded-lg bg-[#ff4d2d] px-4 py-2 font-medium text-white hover:bg-orange-600"
                >
                  <FaPlus size={13} />
                  Add Menu Item
                </button>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Your Menu</h2>

              <span className="text-sm text-gray-500">
                {restaurant.menu?.length || 0} items
              </span>
            </div>

            {!restaurant.menu || restaurant.menu.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <FaUtensils
                  size={40}
                  className="mx-auto mb-4 text-orange-300"
                />

                <h3 className="text-xl font-semibold text-gray-800">
                  Your menu is empty
                </h3>

                <p className="mt-2 text-gray-500">
                  Add your first food item and start building your menu.
                </p>

                <button
                  onClick={() => navigate("/add-menu-item")}
                  className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2.5 font-medium text-white"
                >
                  Add First Item
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {restaurant.menu.map((item) => (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-xl bg-white shadow-sm"
                  >
                    <div className="flex h-40 items-center justify-center bg-orange-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUtensils size={45} className="text-orange-300" />
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.category}
                      </p>

                      <p className="mt-3 font-bold text-[#ff4d2d]">
                        Rs. {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
