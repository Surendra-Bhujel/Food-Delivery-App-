import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiTag,
} from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdAccessTime, MdLocalFireDepartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const OwnerItemCard = ({
  data,
  onEdit,
  onDelete,
  onToggleAvailability,
  onView,
}) => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Function to get correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads/")) {
      return imagePath;
    }

    if (!imagePath.includes("/")) {
      return `/uploads/${imagePath}`;
    }

    return imagePath;
  };

  const imageUrl = getImageUrl(data.image);
  const showImage = imageUrl && !imgError;

  // Spicy level indicator
  const getSpicyLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "mild":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hot":
        return "bg-orange-100 text-orange-700";
      case "extra hot":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Food type indicator
  const getFoodTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "vegetarian":
        return "bg-green-100 text-green-700";
      case "non-vegetarian":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Navigate to edit page unless the parent supplies its own onEdit handler
  const handleEdit = () => {
    if (onEdit) {
      onEdit(data._id);
    } else {
      navigate(`/edit-menu-item/${data._id}`);
    }
  };

  return (
    <div
      className="group relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={imageUrl}
            alt={data.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <FiEye className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">No Image</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-lg transition-all duration-300 ${
              data.isAvailable
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
            {data.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Quick Action Buttons (Visible on Hover) */}
        <div
          className={`absolute right-4 top-4 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          {onToggleAvailability && (
            <button
              onClick={() => onToggleAvailability(data._id)}
              className="rounded-full bg-white p-2.5 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
              title={
                data.isAvailable ? "Mark as Unavailable" : "Mark as Available"
              }
            >
              {data.isAvailable ? (
                <FiEye className="h-4 w-4 text-green-600" />
              ) : (
                <FiEyeOff className="h-4 w-4 text-red-600" />
              )}
            </button>
          )}
        </div>

        {/* Like Button (Optional) */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute right-4 bottom-4 rounded-full bg-white p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
        >
          {isLiked ? (
            <FaHeart className="h-4 w-4 text-red-500" />
          ) : (
            <FaRegHeart className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 transition-colors group-hover:text-[#ff4d2d]">
              {data.name}
            </h3>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {data.foodType && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getFoodTypeColor(
                    data.foodType,
                  )}`}
                >
                  {data.foodType}
                </span>
              )}

              {data.spicyLevel && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getSpicyLevelColor(
                    data.spicyLevel,
                  )}`}
                >
                  🌶️ {data.spicyLevel}
                </span>
              )}

              {data.preparationTime && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  <MdAccessTime className="h-3 w-3" />
                  {data.preparationTime}m
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xl font-bold text-[#ff4d2d]">
              Rs. {data.price}
            </span>

            {data.category && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <FiTag className="h-3 w-3" />
                {data.category}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600">
            {data.description}
          </p>
        )}

        {/* Additional Info */}
        {(data.calories || data.rating) && (
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            {data.calories && (
              <span className="flex items-center gap-1">
                <MdLocalFireDepartment className="h-3 w-3 text-orange-500" />
                {data.calories} cal
              </span>
            )}

            {data.rating && (
              <span className="flex items-center gap-1">
                <FiStar className="h-3 w-3 text-yellow-500" />
                {data.rating} ★
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          {/* Left side - Stats */}
          <div className="flex items-center gap-4">
            {data.ordersCount && (
              <span className="text-xs text-gray-500">
                {data.ordersCount} orders
              </span>
            )}
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Button */}
            <button
              onClick={() => onView && onView(data._id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            >
              View
            </button>

            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:scale-105"
            >
              <FiEdit2 className="h-4 w-4" />
              Edit
            </button>

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={() => onDelete(data._id)}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:scale-105"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
