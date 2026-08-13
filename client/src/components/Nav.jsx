import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const Nav = () => {
  const { userData, city } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Logout
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
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <nav
      className="
        w-full
        h-[80px]
        flex
        items-center
        justify-between
        md:justify-center
        gap-[30px]
        px-[20px]
        fixed
        top-0
        left-0
        z-[9999]
        bg-[#fff9f6]
      "
    >
      {/* ================= LOGO ================= */}
      <h1 className="text-3xl font-bold text-[#ff4d2d]">MithoDelivery</h1>

      {/* ================= DESKTOP SEARCH ================= */}
      <div
        className="
          md:w-[60%]
          lg:w-[40%]
          h-[70px]
          bg-white
          shadow-xl
          rounded-lg
          items-center
          gap-[20px]
          px-[20px]
          hidden
          md:flex
        "
      >
        {/* Location */}
        <div
          className="
            flex
            items-center
            w-[30%]
            overflow-hidden
            gap-[10px]
            px-[10px]
            border-r-[2px]
            border-gray-400
          "
        >
          <FaLocationDot size={25} className="text-[#ff4d2d]" />

          <div
            className="
              w-[80%]
              truncate
              text-gray-600
            "
          >
            {city || "Detecting..."}
          </div>
        </div>

        {/* Search Input */}
        <div
          className="
            w-[70%]
            flex
            items-center
            gap-[10px]
          "
        >
          <FaSearch size={25} className="text-[#ff4d2d]" />

          <input
            type="text"
            placeholder="Search Delicious Food..."
            className="
              px-[10px]
              text-gray-700
              outline-none
              w-full
            "
          />
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-4">
        {/* ================= MOBILE SEARCH ICON ================= */}
        <div
          onClick={() => setShowSearch((prev) => !prev)}
          className="
            md:hidden
            cursor-pointer
          "
        >
          {showSearch ? (
            <RxCross1 size={25} className="text-[#ff4d2d]" />
          ) : (
            <FaSearch size={25} className="text-[#ff4d2d]" />
          )}
        </div>

        {/* ================= CART ================= */}
        <div className="relative cursor-pointer">
          <IoCartOutline size={25} className="text-[#ff4d2d]" />

          <span
            className="
              absolute
              right-[-9px]
              top-[-12px]
              text-[#ff4d2d]
              text-sm
            "
          >
            0
          </span>
        </div>

        {/* ================= MY ORDERS ================= */}
        <button
          className="
            hidden
            md:block
            px-3
            py-1
            rounded-lg
            bg-[#ff4d2d]/10
            text-[#ff4d2d]
            text-sm
            font-medium
          "
        >
          My Orders
        </button>

        {/* ================= USER AVATAR ================= */}
        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className="
            w-[40px]
            h-[40px]
            rounded-full
            flex
            items-center
            justify-center
            bg-[#ff4d2d]
            text-white
            text-[18px]
            shadow-xl
            font-semibold
            cursor-pointer
          "
        >
          {userData?.username?.slice(0, 1).toUpperCase() || "U"}
        </div>

        {/* ================= USER DROPDOWN ================= */}
        {showInfo && (
          <div
            className="
              fixed
              top-[80px]
              right-[10px]
              md:right-[10%]
              lg:right-[25%]
              w-[180px]
              bg-white
              shadow-2xl
              rounded-xl
              p-[20px]
              flex
              flex-col
              gap-[10px]
              z-[9999]
            "
          >
            {/* Username */}
            <div
              className="
                text-[17px]
                font-semibold
                text-gray-800
              "
            >
              {userData?.username || "User"}
            </div>

            {/* Mobile My Orders */}
            <div
              className="
                md:hidden
                text-[#ff4d2d]
                font-semibold
                cursor-pointer
              "
            >
              My Orders
            </div>

            {/* Logout */}
            <div
              onClick={handleLogout}
              className="
                text-[#ff4d2d]
                font-semibold
                cursor-pointer
              "
            >
              Log Out
            </div>
          </div>
        )}

        {/* ================= MOBILE SEARCH BOX ================= */}
        {showSearch && (
          <div
            className="
              fixed
              top-[80px]
              left-[20px]
              right-[20px]
              bg-white
              shadow-xl
              rounded-lg
              p-[15px]
              flex
              items-center
              gap-[10px]
              z-[9998]
              md:hidden
            "
          >
            <FaSearch size={22} className="text-[#ff4d2d]" />

            <input
              type="text"
              placeholder="Search Delicious Food..."
              autoFocus
              className="
                px-[10px]
                text-gray-700
                outline-none
                w-full
              "
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
