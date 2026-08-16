import React, { useState } from "react";
import { FiTag, FiStar, FiPlus, FiMinus } from "react-icons/fi";
import { MdAccessTime, MdLocalFireDepartment } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

const FoodCard = ({ data, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  const MIN_QUANTITY = 1;
  const MAX_QUANTITY = 20;

  const increaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, MAX_QUANTITY));
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(prev - 1, MIN_QUANTITY));
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!onAddToCart || !data.isAvailable) return;

    try {
      setAdding(true);
      await onAddToCart(data, quantity);
      setQuantity(1);
    } finally {
      setAdding(false);
    }
  };

  const restaurantName =
    typeof data.restaurant === "object" ? data.restaurant?.name : null;

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={imageUrl}
            alt={data.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-gray-500">
            No Image
          </div>
        )}

        {!data.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800">
              Currently Unavailable
            </span>
          </div>
        )}

        {data.foodType && (
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shadow ${getFoodTypeColor(
              data.foodType,
            )}`}
          >
            {data.foodType}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {restaurantName && (
          <p className="mb-1 text-xs font-medium text-gray-400">
            {restaurantName}
          </p>
        )}

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-gray-800 transition-colors group-hover:text-[#ff4d2d]">
            {data.name}
          </h3>

          <span className="whitespace-nowrap text-lg font-bold text-[#ff4d2d]">
            Rs. {data.price}
          </span>
        </div>

        {data.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {data.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {data.category && (
            <span className="inline-flex items-center gap-1">
              <FiTag className="h-3 w-3" />
              {data.category}
            </span>
          )}

          {data.preparationTime && (
            <span className="inline-flex items-center gap-1">
              <MdAccessTime className="h-3 w-3" />
              {data.preparationTime}m
            </span>
          )}

          {data.calories && (
            <span className="inline-flex items-center gap-1">
              <MdLocalFireDepartment className="h-3 w-3 text-orange-500" />
              {data.calories} cal
            </span>
          )}

          {data.rating && (
            <span className="inline-flex items-center gap-1">
              <FiStar className="h-3 w-3 text-yellow-500" />
              {data.rating}
            </span>
          )}

          {data.spicyLevel && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${getSpicyLevelColor(
                data.spicyLevel,
              )}`}
            >
              🌶️ {data.spicyLevel}
            </span>
          )}
        </div>

        {onAddToCart && (
          <div className="mt-4 flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!data.isAvailable || quantity <= MIN_QUANTITY}
                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiMinus className="h-3.5 w-3.5" />
              </button>

              <span className="w-8 text-center text-sm font-semibold text-gray-800">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={!data.isAvailable || quantity >= MAX_QUANTITY}
                className="flex h-9 w-9 items-center  justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiPlus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!data.isAvailable || adding}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ff4d2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63e1f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaShoppingCart className="h-4 w-4" />
              {adding
                ? "Adding..."
                : !data.isAvailable
                  ? "Unavailable"
                  : "Add to Cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
