import React, { useState } from "react";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

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

  const menuItem = item.menuItem;
  const imageUrl = getImageUrl(menuItem?.image);
  const itemTotal = item.priceAtAdd * item.quantity;

  const handleIncrease = async () => {
    try {
      setUpdating(true);
      await onIncrease(item);
    } finally {
      setUpdating(false);
    }
  };

  const handleDecrease = async () => {
    try {
      setUpdating(true);
      await onDecrease(item);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await onRemove(item);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={menuItem?.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-gray-800">
          {menuItem?.name || "Item unavailable"}
        </h3>

        <p className="mt-0.5 text-sm text-gray-500">
          Rs. {item.priceAtAdd} each
        </p>

        {item.note && (
          <p className="mt-1 text-xs italic text-gray-400">Note: {item.note}</p>
        )}

        {menuItem && !menuItem.isAvailable && (
          <p className="mt-1 text-xs font-medium text-red-500">
            This item is no longer available
          </p>
        )}
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={updating || removing}
          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiMinus className="h-3.5 w-3.5" />
        </button>

        <span className="w-8 text-center text-sm font-semibold text-gray-800">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={updating || removing}
          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiPlus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Item Total */}
      <div className="w-20 flex-shrink-0 text-right font-bold text-[#ff4d2d]">
        Rs. {itemTotal}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing || updating}
        className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        title="Remove item"
      >
        <FiTrash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartItemCard;
