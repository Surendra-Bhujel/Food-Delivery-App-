import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch, FaPlus } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { TbReceiptDollar } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const Nav = () => {
  const { userData, city } = useSelector((state) => state.user);
  const { myRestaurantData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(setUserData(null));
      setShowInfo(false);
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  const isCustomer = userData?.role === "customer";
  const isOwner = userData?.role === "owner";

  return (
    <nav className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 left-0 z-[9999] bg-[#fff9f6]">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-[#ff4d2d]">MithoDelivery</h1>

      {/* Desktop search - only for customers */}
      {isCustomer && (
        <div className="md:w-[60%] lg:w-[40%] h-[50px] bg-white shadow-xl rounded-lg items-center gap-[20px] px-[20px] hidden md:flex">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">
              {city || "Detecting..."}
            </div>
          </div>

          <div className="w-[70%] flex items-center gap-[10px]">
            <FaSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search Delicious Food..."
              className="px-[10px] text-gray-700 outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-4">
        {isOwner ? (
          <>
            {/* Add Food Item - only if restaurant exists */}
            {myRestaurantData && (
              <>
                {/* Desktop */}
                <button className="hidden md:flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20">
                  <FaPlus size={16} />
                  <span>Add Food Item</span>
                </button>

                {/* Mobile */}
                <button className="md:hidden flex items-center px-3 py-1 cursor-pointer rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20">
                  <FaPlus size={16} />
                </button>
              </>
            )}

            {/* My Orders - Desktop */}
            <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20">
              <TbReceiptDollar size={20} />
              <span>My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>

            {/* My Orders - Mobile */}
            <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20">
              <TbReceiptDollar size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Mobile search icon */}
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

            {/* Cart */}
            {isCustomer && (
              <div className="relative cursor-pointer">
                <IoCartOutline size={25} className="text-[#ff4d2d]" />
                <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d] text-sm">
                  0
                </span>
              </div>
            )}

            {/* My Orders - desktop */}
            <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20 cursor-pointer">
              My Orders
            </button>
          </>
        )}

        {/* User avatar */}
        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
        >
          {userData?.username?.slice(0, 1).toUpperCase() || "U"}
        </div>

        {/* User dropdown menu */}
        {showInfo && (
          <div className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[17px] font-semibold text-gray-800">
              {userData?.username || "User"}
            </div>

            {isCustomer && (
              <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
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

        {/* Mobile search box */}
        {isCustomer && showSearch && (
          <div className="fixed top-[80px] left-[20px] right-[20px] bg-white shadow-xl rounded-lg p-[15px] flex items-center gap-[10px] z-[9998] md:hidden">
            <FaSearch size={22} className="text-[#ff4d2d]" />
            <input
              type="text"
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
