import React from "react";
import { useSelector } from "react-redux";
import Nav from "../components/Nav.jsx";
import useGetMyRestaurant from "../hooks/useGetMyRestaurant";

const OwnerDashboard = () => {
  useGetMyRestaurant();

  const { restaurant } = useSelector((state) => state.owner);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />

      <div className="w-full max-w-6xl px-4 pt-[110px]">
        {!restaurant ? (
          <div className="flex justify-center items-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OwnerDashboard;
