import React from "react";
import { useSelector } from "react-redux";
import Nav from "../components/Nav.jsx";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { restaurant } = useSelector((state) => state.owner);
  const navigate=useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />

      {!restaurant ? (
        <div className="w-full flex justify-center px-4 pt-[100px]">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">

              {/* Icon */}
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#ff4d2d]/10 mb-5">
                <FaUtensils
                  className="text-[#ff4d2d]"
                  size={40}
                />
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl text-gray-800 font-bold mb-3">
                Add Your Restaurant
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>

              {/* Button */}
              <button
                type="button"
                className="bg-[#ff4d2d] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#e63e1f] transition-colors duration-200 cursor-pointer"
              onClick={()=>navigate("/create-restaurant")}>
                Get Started
              </button>

            </div>
          </div>
        </div>
      ) : (
        <div className="w-full pt-[100px] flex justify-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Restaurant
          </h2>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;