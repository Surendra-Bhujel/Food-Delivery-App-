import React from "react";
import { IoMdArrowBack } from "react-icons/io";

const CreateEditRestaurant = () => {
  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div className="absolute top-[20px] left-[20px] z-[10] mb-[10px]">
         <IoMdArrowBack size={35} className="text-[#ff4d2d]" />

      </div>
    </div>
  );
};

export default CreateEditRestaurant;
