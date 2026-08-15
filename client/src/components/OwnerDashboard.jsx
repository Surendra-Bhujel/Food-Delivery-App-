import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav.jsx";
import OwnerItemCard from "../components/OwnerItemCard.jsx";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const { restaurant } = useSelector((state) => state.owner);

  // If restaurant hasn't been created yet
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />

        <div className="flex min-h-[calc(100vh-70px)] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
            <h1 className="mb-3 text-2xl font-bold text-gray-800">
              Add Your Restaurant
            </h1>

            <p className="mb-6 text-gray-500">
              Create your restaurant profile and start adding your food items.
            </p>

            <button
              onClick={() => navigate("/create-restaurant")}
              className="rounded-lg bg-[#ff4d2d] px-6 py-3 font-semibold text-white transition hover:bg-[#e63e1f]"
            >
              Create Restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  const restaurantImage =
    restaurant.logo || "https://via.placeholder.com/900x400?text=Restaurant";

  const cuisine =
    restaurant.cuisineType && restaurant.cuisineType.length > 0
      ? restaurant.cuisineType.join(", ")
      : "Not specified";

  const city = restaurant.address?.city || "";
  const state = restaurant.address?.state || "";
  const formattedAddress =
    restaurant.address?.formattedAddress || "Address not available";

  const phone = restaurant.contact?.phone || "Phone number not available";

  const menuItems = restaurant.menu || [];

  const handleDelete = (id) => {
    // TODO: connect to your delete API / Redux action
    console.log("Delete item:", id);
  };

  const handleToggleAvailability = (id) => {
    // TODO: connect to your toggle-availability API / Redux action
    console.log("Toggle availability:", id);
  };

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-[100px] sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Restaurant Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant and menu from here.
          </p>
        </div>

        {/* Restaurant card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          {/* Restaurant image */}
          <div className="h-56 w-full sm:h-72">
            <img
              src={restaurantImage}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Restaurant information */}
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              {/* Left side */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                  {restaurant.name}
                </h2>

                <p className="mt-2 text-gray-500">{cuisine}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Location:</span>{" "}
                    {formattedAddress}
                    {city && `, ${city}`}
                    {state && `, ${state}`}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">Phone:</span>{" "}
                    {phone}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Delivery time:
                    </span>{" "}
                    {restaurant.estimatedDeliveryTime || 30} minutes
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Delivery fee:
                    </span>{" "}
                    Rs. {restaurant.deliveryFee || 0}
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    restaurant.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>

                <div className="text-sm text-gray-600">
                  Rating:{" "}
                  <span className="font-semibold text-gray-800">
                    {restaurant.rating || 0}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/edit-restaurant/${restaurant._id}`)}
                  className="rounded-lg border border-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-[#ff4d2d] transition hover:bg-[#ff4d2d] hover:text-white"
                >
                  Edit Restaurant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu section */}
        <div className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Menu</h2>

              <p className="mt-1 text-sm text-gray-500">
                Add and manage the food items available in your restaurant.
              </p>
            </div>

            <button
              onClick={() => navigate("/add-menu-item")}
              className="rounded-lg bg-[#ff4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e63e1f]"
            >
              + Add Menu Item
            </button>
          </div>

          {/* Menu items */}
          {menuItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                Your menu is empty
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first food item so customers can see what you offer.
              </p>

              <button
                onClick={() => navigate("/add-menu-item")}
                className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <OwnerItemCard
                  key={item._id}
                  data={item}
                  onDelete={handleDelete}
                  onToggleAvailability={handleToggleAvailability}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
