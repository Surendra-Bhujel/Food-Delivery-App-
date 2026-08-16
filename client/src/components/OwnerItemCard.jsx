import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiTag,
  FiX,
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
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Open the built-in detail modal unless the parent supplies its own onView handler
  const handleView = () => {
    if (onView) {
      onView(data._id);
    } else {
      setShowDetails(true);
    }
  };

  // Confirm before calling the parent's delete handler
  const handleDeleteClick = async () => {
    if (!onDelete) return;

    const confirmed = window.confirm(
      `Delete "${data.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await onDelete(data._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
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
                onClick={handleView}
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
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiTrash2 className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
            >
              <FiX className="h-5 w-5 text-gray-700" />
            </button>

            {/* Image */}
            <div className="h-64 w-full bg-gray-100">
              {showImage ? (
                <img
                  src={imageUrl}
                  alt={data.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="max-h-[50vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {data.name}
                </h2>

                <span className="whitespace-nowrap text-xl font-bold text-[#ff4d2d]">
                  Rs. {data.price}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    data.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {data.isAvailable ? "Available" : "Unavailable"}
                </span>

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
              </div>

              {data.description && (
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {data.description}
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">
                    {data.category || "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Prep Time</p>
                  <p className="font-medium text-gray-800">
                    {data.preparationTime ? `${data.preparationTime} min` : "—"}
                  </p>
                </div>

                {data.calories && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="font-medium text-gray-800">
                      {data.calories} cal
                    </p>
                  </div>
                )}

                {data.rating && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-medium text-gray-800">{data.rating} ★</p>
                  </div>
                )}
              </div>

              {/* Modal actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleEdit();
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit Item
                </button>

                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerItemCard;
