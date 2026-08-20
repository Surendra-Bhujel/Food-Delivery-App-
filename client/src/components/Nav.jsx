import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch, FaPlus } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { TbReceiptDollar } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { serverUrl } from "../App";
import { setUserData, setCurrentLocation } from "../redux/userSlice";

const Nav = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const { userData, currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );

  const { restaurant } = useSelector((state) => state.owner);

  // Correct selector based on your cart slice structure
  const { items: cartItems } = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const cartItemCount =
    cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    if (currentCity && currentState && currentAddress) {
      return;
    }

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
                addressdetails: 1,
              },
            },
          );

          const addressData = response.data.address;

          const city =
            addressData.city ||
            addressData.town ||
            addressData.village ||
            addressData.municipality ||
            "";

          const state = addressData.state || addressData.province || "";

          const address = response.data.display_name || "";

          dispatch(
            setCurrentLocation({
              city,
              state,
              address,
              latitude,
              longitude,
            }),
          );
        } catch (error) {
          console.log("Location error:", error);
        }
      },
      (error) => {
        console.log("Geolocation error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [currentCity, currentState, currentAddress, dispatch]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      dispatch(setUserData(null));
      setShowInfo(false);
      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  const isCustomer = userData?.role === "customer";

  const isOwner = userData?.role === "owner";

  const handleSearchInput = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <nav className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 left-0 z-[9999] bg-[#fff9f6]">
      <h1
        className="text-3xl font-bold text-[#ff4d2d] cursor-pointer"
        onClick={() => navigate("/")}
      >
        MithoDelivery
      </h1>

      {isCustomer && (
        <div className="md:w-[60%] lg:w-[40%] h-[50px] bg-white shadow-xl rounded-lg items-center gap-[20px] px-[20px] hidden md:flex">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />

            <div className="w-[80%] truncate text-gray-600">
              {currentCity || "Detecting..."}
            </div>
          </div>

          <div className="w-[70%] flex items-center gap-[10px]">
            <FaSearch size={25} className="text-[#ff4d2d]" />

            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search Delicious Food..."
              className="px-[10px] text-gray-700 outline-none w-full"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {isOwner ? (
          <>
            {restaurant && (
              <>
                <button
                  onClick={() => navigate("/add-menu-item")}
                  className="hidden md:flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20"
                >
                  <FaPlus size={16} />
                  <span>Add Food Item</span>
                </button>

                <button
                  onClick={() => navigate("/add-menu-item")}
                  className="md:hidden flex items-center px-3 py-1 cursor-pointer rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]"
                >
                  <FaPlus size={16} />
                </button>
              </>
            )}

            <div
              onClick={() => navigate("/owner-orders")}
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20"
            >
              <TbReceiptDollar size={20} />

              <span>My Orders</span>

              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>

            <div
              onClick={() => navigate("/owner-orders")}
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg text-[#ff4d2d]"
            >
              <TbReceiptDollar size={20} />

              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {isCustomer && (
              <div
                onClick={() => setShowSearch((prev) => !prev)}
                className="md:hidden cursor-pointer"
              >
                {showSearch ? (
                  <RxCross1 size={25} className="text-[#ff4d2d]" />
                ) : (
                  <FaSearch size={25} className="text-[#ff4d2d]" />
                )}
              </div>
            )}

            {isCustomer && (
              <div
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer"
              >
                <IoCartOutline size={25} className="text-[#ff4d2d]" />

                {cartItemCount > 0 && (
                  <span className="absolute right-[-9px] top-[-12px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ff4d2d] text-[11px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => navigate("/my-orders")}
              className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20 cursor-pointer"
            >
              My Orders
            </button>
          </>
        )}

        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
        >
          {userData?.username?.slice(0, 1).toUpperCase() || "U"}
        </div>

        {showInfo && (
          <div className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[17px] font-semibold text-gray-800">
              {userData?.username || "User"}
            </div>

            {isCustomer && (
              <div
                onClick={() => {
                  navigate("/my-orders");
                  setShowInfo(false);
                }}
                className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer"
              >
                My Orders
              </div>
            )}

            <div
              onClick={handleLogout}
              className="text-[#ff4d2d] font-semibold cursor-pointer"
            >
              Log Out
            </div>
          </div>
        )}

        {isCustomer && showSearch && (
          <div className="fixed top-[80px] left-[20px] right-[20px] bg-white shadow-xl rounded-lg p-[15px] flex items-center gap-[10px] z-[9998] md:hidden">
            <FaSearch size={22} className="text-[#ff4d2d]" />

            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search Delicious Food..."
              autoFocus
              className="px-[10px] text-gray-700 outline-none w-full"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
