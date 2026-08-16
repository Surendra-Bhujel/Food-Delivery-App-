import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiPackage } from "react-icons/fi";
import axios from "axios";

import Nav from "../components/Nav.jsx";
import OrderCard from "../components/OrderCard.jsx";
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

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(`${serverUrl}/api/orders/mine`, {
          params: statusFilter ? { status: statusFilter } : {},
          withCredentials: true,
        });

        setOrders(response.data.data || []);
      } catch (err) {
        console.error(
          "Fetch orders error:",
          err.response?.data || err.message,
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-[100px] sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-700 transition hover:text-[#ff4d2d]"
        >
          <IoMdArrowBack size={22} />
          <span>Back</span>
        </button>

        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          My Orders
        </h1>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                statusFilter === filter.value
                  ? "bg-[#ff4d2d] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-500">
              Something went wrong loading your orders. Please try again.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <FiPackage className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {statusFilter
                ? `You have no ${statusFilter.replace(/_/g, " ")} orders.`
                : "You haven't placed any orders yet."}
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;