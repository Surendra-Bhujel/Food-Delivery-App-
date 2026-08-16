import React from "react";

const CategoryCard = ({ category, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-shrink-0 flex-col items-center gap-2 group"
    >
      <div
        className={`h-24 w-24 overflow-hidden rounded-full border-4 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:h-28 sm:w-28 ${
          isSelected
            ? "border-[#ff4d2d] shadow-lg shadow-[#ff4d2d]/20"
            : "border-white"
        }`}
      >
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <span
        className={`text-sm font-semibold whitespace-nowrap ${
          isSelected ? "text-[#ff4d2d]" : "text-gray-700"
        }`}
      >
        {category.name}
      </span>
    </button>
  );
};

export default CategoryCard;
