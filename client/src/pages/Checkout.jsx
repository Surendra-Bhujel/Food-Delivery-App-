import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiCrosshair } from "react-icons/fi";
import { FaMoneyBillWave, FaCreditCard, FaWallet } from "react-icons/fa";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Nav from "../components/Nav.jsx";
import { serverUrl } from "../App";
import { clearCartState } from "../redux/cartSlice";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PAYMENT_METHODS = [
  {
    value: "Cash on Delivery",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    icon: FaMoneyBillWave,
  },
  {
    value: "card",
    label: "Card",
    description: "Pay securely with your debit or credit card",
    icon: FaCreditCard,
  },
  {
    value: "digital_wallet",
    label: "Digital Wallet",
    description: "Pay using your preferred digital wallet",
    icon: FaWallet,
  },
];

const LocationMarker = ({ position, onMove }) => {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          onMove(latlng.lat, latlng.lng);
        },
      }}
    />
  ) : null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalAmount } = useSelector((state) => state.cart);

  const { userData, currentAddress, currentLatitude, currentLongitude } =
    useSelector((state) => state.user);

  const [formattedAddress, setFormattedAddress] = useState(
    currentAddress || "",
  );

  const [contactNumber, setContactNumber] = useState(userData?.phone || "");
  const [instructions, setInstructions] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [latitude, setLatitude] = useState(currentLatitude || null);
  const [longitude, setLongitude] = useState(currentLongitude || null);

  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reverseGeocode = async (lat, lng) => {
    try {
      setGeocoding(true);

      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat,
            lon: lng,
            format: "json",
            addressdetails: 1,
          },
        },
      );

      const address = response.data.display_name || "";

      if (address) {
        setFormattedAddress(address);
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
    } finally {
      setGeocoding(false);
    }
  };

  const handleMapMove = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    reverseGeocode(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        setLatitude(lat);
        setLongitude(lng);

        reverseGeocode(lat, lng);

        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err.message);

        setError(
          "Could not get your location. Please allow location access or select on the map.",
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formattedAddress.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    if (!contactNumber.trim()) {
      setError("Please enter a contact number.");
      return;
    }

    if (latitude === null || longitude === null) {
      setError(
        "Please set your delivery location using 'Use my location' or by selecting it on the map.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${serverUrl}/api/orders/checkout`,
        {
          deliveryAddress: {
            coordinates: [longitude, latitude],
            formattedAddress,
            contactNumber,
          },
          deliveryInstructions: instructions,
          specialInstructions,
          paymentMethod,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(clearCartState());

      const order = response.data.data;

      alert(`Order placed successfully! Total: Rs. ${order.totalAmount}`);

      navigate("/my-orders");
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff9f6]">
        <Nav />

        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 pt-[80px]">
          <p className="text-gray-500">Your cart is empty.</p>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const mapCenter =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : [27.7, 85.3];

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-[100px] sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center gap-2 text-gray-700 transition hover:text-[#ff4d2d]"
        >
          <IoMdArrowBack size={22} />
          <span>Back to Cart</span>
        </button>

        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.menuItem?.name || "Item"} × {item.quantity}
                  </span>

                  <span>Rs. {item.priceAtAdd * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-sm font-medium text-gray-700">
              <span>Subtotal</span>
              <span>Rs. {totalAmount}</span>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Delivery fee and tax will be calculated and shown on your order
              confirmation.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Delivery Location
              </h2>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center gap-1.5 rounded-lg bg-[#ff4d2d]/10 px-3 py-1.5 text-xs font-semibold text-[#ff4d2d] transition hover:bg-[#ff4d2d]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiCrosshair className="h-3.5 w-3.5" />

                {locating ? "Locating..." : "Use My Location"}
              </button>
            </div>

            <p className="mb-3 text-xs text-gray-400">
              Drag the pin or tap on the map to set your exact delivery
              location.
            </p>

            <div className="h-72 w-full overflow-hidden rounded-xl border border-gray-200">
              <MapContainer
                center={mapCenter}
                zoom={latitude !== null ? 16 : 12}
                key={`${mapCenter[0]}-${mapCenter[1]}`}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker
                  position={
                    latitude !== null && longitude !== null
                      ? [latitude, longitude]
                      : null
                  }
                  onMove={handleMapMove}
                />
              </MapContainer>
            </div>

            {geocoding && (
              <p className="mt-2 text-xs text-gray-400">
                Looking up address...
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Delivery Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Delivery Address
                </label>

                <input
                  type="text"
                  value={formattedAddress}
                  onChange={(e) => setFormattedAddress(e.target.value)}
                  placeholder="Enter your delivery address, or set it on the map above"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contact Number
                </label>

                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter contact number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Delivery Instructions
                </label>

                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Leave at the gate (optional)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Special Instructions for Restaurant
                </label>

                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. No onions (optional)"
                  rows="3"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#ff4d2d]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Payment Method
            </h2>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.value;

                return (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-3.5 transition ${
                      isSelected
                        ? "border-[#ff4d2d] bg-[#ff4d2d]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition ${
                        isSelected
                          ? "bg-[#ff4d2d] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          isSelected ? "text-[#ff4d2d]" : "text-gray-800"
                        }`}
                      >
                        {method.label}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {method.description}
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={isSelected}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-[#ff4d2d]"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ff4d2d] px-5 py-3 font-semibold text-white transition hover:bg-[#e63e1f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
