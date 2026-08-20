import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Nav from "../components/Nav.jsx";
import { serverUrl } from "../App";
import useOrderTracking from "../hooks/useOrderTracking";

import scooterIcon from "../assets/scooter.png";

const scooterMarker = new L.Icon({
  iconUrl: scooterIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "assigned",
  "out_for_delivery",
  "delivered",
];

const STATUS_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  assigned: "Rider Assigned",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const tracking = useOrderTracking(id);
  const liveStatus = tracking.liveStatus;
  const riderLocation = tracking.riderLocation;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(serverUrl + "/api/orders/" + id, {
          withCredentials: true,
        });

        setOrder(response.data.data);
      } catch (err) {
        console.error(
          "Fetch order error:",
          err.response ? err.response.data : err.message,
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchLastLocation = async () => {
      try {
        await axios.get(serverUrl + "/api/rider/location/" + id, {
          withCredentials: true,
        });
      } catch (err) {
        // No location yet — not an error state, just nothing to show
      }
    };

    fetchOrder();
    fetchLastLocation();
  }, [id]);

  const currentStatus =
    (liveStatus && liveStatus.status) || (order && order.status);

  const currentStepIndex = STATUS_STEPS.indexOf(currentStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center pt-[80px]">
          <p className="text-gray-700">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 pt-[80px]">
          <p className="text-gray-700">Order not found.</p>
          <button
            onClick={function () {
              navigate("/my-orders");
            }}
            className="rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const showMap = currentStatus === "out_for_delivery" && riderLocation;

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-[100px] sm:px-6">
        <button
          type="button"
          onClick={function () {
            navigate("/my-orders");
          }}
          className="mb-6 flex items-center gap-2 font-medium text-gray-800 transition hover:text-[#ff4d2d]"
        >
          <IoMdArrowBack size={22} />
          <span>Back to My Orders</span>
        </button>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {"Order #" + order._id.slice(-6).toUpperCase()}
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          {order.restaurant && order.restaurant.name}
        </p>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-lg font-bold text-gray-900">Order Status</h2>

          <div className="space-y-4">
            {STATUS_STEPS.map(function (step, idx) {
              const isComplete = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="flex items-center gap-3">
                  {isComplete ? (
                    <FiCheckCircle
                      className={
                        "h-5 w-5 flex-shrink-0 " +
                        (isCurrent ? "text-[#ff4d2d]" : "text-green-600")
                      }
                    />
                  ) : (
                    <FiCircle className="h-5 w-5 flex-shrink-0 text-gray-300" />
                  )}

                  <span
                    className={
                      "text-sm font-semibold " +
                      (isComplete ? "text-gray-900" : "text-gray-400")
                    }
                  >
                    {STATUS_LABELS[step]}
                  </span>

                  {isCurrent ? (
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-[#ff4d2d]/10 px-2.5 py-0.5 text-xs font-semibold text-[#ff4d2d]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4d2d]" />
                      Live
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {showMap ? (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Your Rider is on the way
            </h2>

            <div className="h-72 w-full overflow-hidden rounded-xl border border-gray-200">
              <MapContainer
                center={[riderLocation.latitude, riderLocation.longitude]}
                zoom={16}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[riderLocation.latitude, riderLocation.longitude]}
                  icon={scooterMarker}
                />
              </MapContainer>
            </div>

            <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <MdAccessTime className="h-3.5 w-3.5" />
              {"Last updated " +
                new Date(riderLocation.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Order Details
          </h2>

          <div className="space-y-2">
            {order.items.map(function (item, idx) {
              return (
                <div
                  key={idx}
                  className="flex justify-between text-sm font-medium text-gray-800"
                >
                  <span>{item.name + " × " + item.quantity}</span>
                  <span>{"Rs. " + item.price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{"Rs. " + order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{"Rs. " + order.deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{"Rs. " + order.tax}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
            <span>Total</span>
            <span className="text-[#ff4d2d]">{"Rs. " + order.totalAmount}</span>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-700">
            <p>
              {order.deliveryAddress && order.deliveryAddress.formattedAddress}
            </p>
            {order.deliveryAddress && order.deliveryAddress.instructions ? (
              <p className="mt-1 italic text-gray-600">
                {"Note: " + order.deliveryAddress.instructions}
              </p>
            ) : null}
          </div>

          {order.rider ? (
            <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs font-semibold text-blue-800">
              {"Rider: " + order.rider.username}
              {order.rider.phone ? " (" + order.rider.phone + ")" : ""}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
