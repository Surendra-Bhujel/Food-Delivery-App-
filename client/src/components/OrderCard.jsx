import React from "react";
import { useNavigate } from "react-router-dom";
import { MdAccessTime } from "react-icons/md";
import { FiPackage } from "react-icons/fi";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  assigned: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  assigned: "Rider Assigned",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const restaurantName = order.restaurant?.name || "Restaurant";
  const restaurantLogo =
    order.restaurant?.logo || "https://via.placeholder.com/100x100?text=Food";

  const itemsPreview = order.items
    .map((item) => `${item.name} × ${item.quantity}`)
    .join(", ");

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={() => navigate(`/orders/${order._id}/track`)}
      className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {/* Restaurant Logo */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={restaurantLogo}
            alt={restaurantName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-800">{restaurantName}</h3>

            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-sm text-gray-500">
            {itemsPreview}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MdAccessTime className="h-3.5 w-3.5" />
              {orderDate}
            </span>

            <span className="flex items-center gap-1">
              <FiPackage className="h-3.5 w-3.5" />
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="font-bold text-[#ff4d2d]">Rs. {order.totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
