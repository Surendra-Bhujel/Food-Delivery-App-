import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiPackage, FiUser, FiPhone } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import axios from "axios";

import Nav from "../components/Nav.jsx";
import { serverUrl } from "../App";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  assigned: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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

const OwnerOrders = () => {
  const navigate = useNavigate();

  const { restaurant } = useSelector((state) => state.owner);

  const [orders, setOrders] = useState([]);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const [confirmingId, setConfirmingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedRiders, setSelectedRiders] = useState({});

  const fetchOrders = async () => {
    if (!restaurant?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const response = await axios.get(
        `${serverUrl}/api/orders/restaurant/${restaurant._id}`,
        {
          params: statusFilter ? { status: statusFilter } : {},
          withCredentials: true,
        },
      );

      setOrders(response.data.data || []);
    } catch (err) {
      console.error(
        "Fetch restaurant orders error:",
        err.response?.data || err.message,
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRiders = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/orders/available-riders`,
        { withCredentials: true },
      );

      setAvailableRiders(response.data.data || []);
    } catch (err) {
      console.error(
        "Fetch available riders error:",
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAvailableRiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?._id, statusFilter]);

  const handleConfirm = async (orderId) => {
    try {
      setConfirmingId(orderId);

      await axios.put(
        `${serverUrl}/api/orders/${orderId}/confirm`,
        {},
        { withCredentials: true },
      );

      await fetchOrders();
    } catch (err) {
      console.error("Confirm order error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to confirm order.");
    } finally {
      setConfirmingId(null);
    }
  };

  const handleAssignRider = async (orderId) => {
    const riderId = selectedRiders[orderId];
    if (!riderId) return;

    try {
      setAssigningId(orderId);

      await axios.put(
        `${serverUrl}/api/orders/${orderId}/assign-rider`,
        { riderId },
        { withCredentials: true },
      );

      await fetchOrders();
    } catch (err) {
      console.error("Assign rider error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to assign rider.");
    } finally {
      setAssigningId(null);
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 pt-[80px]">
          <p className="text-gray-700">
            You need a restaurant before you can view orders.
          </p>
          <button
            onClick={() => navigate("/owner-dashboard")}
            className="rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-[100px] sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/owner-dashboard")}
          className="mb-6 flex items-center gap-2 font-medium text-gray-800 transition hover:text-[#ff4d2d]"
        >
          <IoMdArrowBack size={22} />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Orders
        </h1>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                statusFilter === filter.value
                  ? "bg-[#ff4d2d] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-700">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-700">
              Something went wrong loading orders. Please try again.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-gray-700">
              {statusFilter
                ? `No ${statusFilter.replace(/_/g, " ")} orders right now.`
                : "You haven't received any orders yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderIdShort =
                typeof order._id === "string" && order._id.length >= 6
                  ? order._id.slice(-6).toUpperCase()
                  : "N/A";

              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown date";

              const items = Array.isArray(order.items) ? order.items : [];

              const canConfirm = order.status === "pending";
              const canAssignRider =
                (order.status === "confirmed" ||
                  order.status === "preparing") &&
                !order.rider;

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Order #{orderIdShort}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-800">
                        <FiUser className="h-3.5 w-3.5" />
                        <span className="font-semibold text-gray-900">
                          {order.customer?.username || "Customer"}
                        </span>
                      </div>

                      {order.customer?.phone && (
                        <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-gray-700">
                          <FiPhone className="h-3 w-3" />
                          {order.customer.phone}
                        </div>
                      )}
                    </div>

                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[order.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status || "Unknown"}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                    {items.length === 0 ? (
                      <p className="text-sm text-gray-600">
                        No items on this order.
                      </p>
                    ) : (
                      items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm font-medium text-gray-800"
                        >
                          <span>
                            {item?.name || "Item"} × {item?.quantity ?? 0}
                          </span>
                          <span>
                            Rs. {(item?.price ?? 0) * (item?.quantity ?? 0)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-700">
                    <p className="line-clamp-2">
                      {order.deliveryAddress?.formattedAddress ||
                        "No address provided"}
                    </p>
                    {order.deliveryAddress?.instructions && (
                      <p className="mt-1 italic text-gray-600">
                        Note: {order.deliveryAddress.instructions}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-600">
                      <MdAccessTime className="h-3.5 w-3.5" />
                      {orderDate}
                    </span>

                    <span className="text-xs font-medium text-gray-600">
                      Payment: {order.paymentMethod || "N/A"}
                    </span>

                    <span className="font-bold text-[#ff4d2d]">
                      Rs. {order.totalAmount ?? 0}
                    </span>
                  </div>

                  {/* Rider info if assigned */}
                  {order.rider && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
                      <FiPackage className="h-3.5 w-3.5" />
                      Rider: {order.rider.username || "Assigned"}
                      {order.rider.phone && ` (${order.rider.phone})`}
                    </div>
                  )}

                  {/* Actions */}
                  {canConfirm && (
                    <button
                      onClick={() => handleConfirm(order._id)}
                      disabled={confirmingId === order._id}
                      className="mt-4 w-full rounded-lg bg-[#ff4d2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63e1f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {confirmingId === order._id
                        ? "Confirming..."
                        : "Confirm Order"}
                    </button>
                  )}

                  {canAssignRider && (
                    <div className="mt-4 flex gap-2">
                      <select
                        value={selectedRiders[order._id] || ""}
                        onChange={(e) =>
                          setSelectedRiders((prev) => ({
                            ...prev,
                            [order._id]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-[#ff4d2d]"
                      >
                        <option value="">Select a rider</option>
                        {availableRiders.map((rider) => (
                          <option key={rider._id} value={rider._id}>
                            {rider.username}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleAssignRider(order._id)}
                        disabled={
                          !selectedRiders[order._id] ||
                          assigningId === order._id
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {assigningId === order._id ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerOrders;