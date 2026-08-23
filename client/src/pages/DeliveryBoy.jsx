import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FiPackage, FiPhone, FiMapPin, FiNavigation } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Nav from "../components/Nav.jsx";
import { serverUrl } from "../App";
import scooterIcon from "../assets/scooter.png";
import homeIcon from "../assets/home.png";

const scooterMarker = new L.Icon({
  iconUrl: scooterIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

const homeMarker = new L.Icon({
  iconUrl: homeIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const DeliveryBoy = () => {
  const { userData } = useSelector((state) => state.user);

  const [isOnline, setIsOnline] = useState(false);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const watchIdRef = useRef(null);
  const pollingRef = useRef(null);

  // FETCH DELIVERIES

  const fetchDeliveries = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError(false);

      const response = await axios.get(`${serverUrl}/api/rider/my-deliveries`, {
        withCredentials: true,
      });

      setDeliveries(response.data.data || []);
    } catch (err) {
      console.error(
        "Fetch deliveries error:",
        err.response ? err.response.data : err.message,
      );

      setError(true);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // FETCH CURRENT AVAILABILITY

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/rider/availability`, {
        withCredentials: true,
      });

      const availability = response.data?.data?.availability || null;

      setIsOnline(availability === "online");

      return availability;
    } catch (err) {
      console.error(
        "Fetch availability error:",
        err.response ? err.response.data : err.message,
      );

      if (userData?.availability) {
        setIsOnline(userData.availability === "online");
      }

      return null;
    }
  };

  // AUTOMATICALLY SET RIDER ONLINE

  const setRiderOnline = async () => {
    try {
      const currentAvailability = await fetchAvailability();

      // Already online - nothing to do.
      if (currentAvailability === "online") {
        return;
      }

      // Rider is offline, so use the existing toggle endpoint
      // to change the backend status to online.
      if (currentAvailability === "offline") {
        const response = await axios.patch(
          `${serverUrl}/api/rider/availability`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAvailability = response.data?.data?.availability || null;

        setIsOnline(newAvailability === "online");

        console.log("Rider availability after login:", newAvailability);

        return;
      }

      // If the backend did not return a usable availability value,
      // don't blindly toggle the status.
      console.warn(
        "Could not determine rider availability. Automatic online status skipped.",
      );
    } catch (err) {
      console.error(
        "Set rider online error:",
        err.response ? err.response.data : err.message,
      );
    }
  };

  // INITIAL LOAD

  useEffect(() => {
    if (!userData || userData.role !== "rider") {
      return;
    }

    const initializeRider = async () => {
      await setRiderOnline();
      await fetchDeliveries(true);
    };

    initializeRider();
  }, [userData]);

  // RESUME ACTIVE DELIVERY TRACKING

  useEffect(() => {
    const activeDelivery = deliveries.find(
      (order) => order.status === "out_for_delivery",
    );

    if (activeDelivery && trackingOrderId !== activeDelivery._id) {
      startTracking(activeDelivery._id);
    }
  }, [deliveries]);

  // POLL DELIVERIES WHEN ONLINE

  useEffect(() => {
    if (!isOnline) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      return;
    }

    pollingRef.current = setInterval(() => {
      fetchDeliveries(false);
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isOnline]);

  // TOGGLE AVAILABILITY

  const handleToggleAvailability = async () => {
    try {
      setTogglingAvailability(true);

      const response = await axios.patch(
        `${serverUrl}/api/rider/availability`,
        {},
        {
          withCredentials: true,
        },
      );

      const availability = response.data?.data?.availability || null;

      setIsOnline(availability === "online");

      await fetchDeliveries(false);
    } catch (err) {
      console.error(
        "Toggle availability error:",
        err.response ? err.response.data : err.message,
      );

      alert(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setTogglingAvailability(false);
    }
  };

  // SEND LOCATION UPDATE

  const sendLocationUpdate = async (orderId, position) => {
    try {
      const coords = position.coords;

      const latitude = coords.latitude;
      const longitude = coords.longitude;
      const accuracy = coords.accuracy;
      const speed = coords.speed;
      const heading = coords.heading;

      setCurrentPosition({
        latitude,
        longitude,
      });

      await axios.post(
        `${serverUrl}/api/rider/location`,
        {
          orderId,
          latitude,
          longitude,
          accuracy:
            accuracy !== null && accuracy !== undefined ? accuracy : undefined,
          speed: speed !== null && speed !== undefined ? speed : undefined,
          heading:
            heading !== null && heading !== undefined ? heading : undefined,
        },
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error(
        "Send location update error:",
        err.response ? err.response.data : err.message,
      );
    }
  };

  // STOP TRACKING

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);

      watchIdRef.current = null;
    }

    setTrackingOrderId(null);
    setCurrentPosition(null);
  };

  // START TRACKING

  const startTracking = (orderId) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");

      return false;
    }

    stopTracking();

    setTrackingOrderId(orderId);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        sendLocationUpdate(orderId, position);
      },
      (err) => {
        console.error("Geolocation watch error:", err.message);

        if (err.code === 1) {
          alert(
            "Location permission was denied. Please allow location access to share your delivery location.",
          );
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return true;
  };

  // START DELIVERY

  const handleStartDelivery = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");

        return;
      }

      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            resolve();
          },
          (err) => {
            if (err.code === 1) {
              reject(
                new Error(
                  "Please allow location access before starting the delivery.",
                ),
              );
            } else {
              reject(new Error("Unable to get your current location."));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
        );
      });

      await axios.put(
        `${serverUrl}/api/orders/${orderId}/status`,
        {
          status: "out_for_delivery",
        },
        {
          withCredentials: true,
        },
      );

      startTracking(orderId);

      await fetchDeliveries(false);
    } catch (err) {
      console.error(
        "Start delivery error:",
        err.response ? err.response.data : err.message,
      );

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to start delivery.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // MARK DELIVERED

  const handleMarkDelivered = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);

      await axios.put(
        `${serverUrl}/api/orders/${orderId}/status`,
        {
          status: "delivered",
        },
        {
          withCredentials: true,
        },
      );

      if (trackingOrderId === orderId) {
        stopTracking();
      }

      setDeliveries((previousDeliveries) =>
        previousDeliveries.filter((delivery) => delivery._id !== orderId),
      );

      await fetchDeliveries(false);
    } catch (err) {
      console.error(
        "Mark delivered error:",
        err.response ? err.response.data : err.message,
      );

      alert(
        err.response?.data?.message || "Failed to mark order as delivered.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // CLEANUP

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // UI

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-[100px] sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Hi, {userData?.username ? userData.username : "Rider"}
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage your deliveries here.
            </p>
          </div>

          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvailability}
            className={
              "flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 " +
              (isOnline
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300")
            }
          >
            <span
              className={
                "h-2.5 w-2.5 rounded-full " +
                (isOnline ? "bg-green-600" : "bg-gray-500")
              }
            />

            {togglingAvailability
              ? "Updating..."
              : isOnline
                ? "Online"
                : "Offline"}
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-700">Loading deliveries...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-700">
              Something went wrong loading deliveries.
            </p>

            <button
              onClick={() => fetchDeliveries(true)}
              className="mt-4 rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
            >
              Try Again
            </button>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No active deliveries
            </h3>

            <p className="mt-2 text-sm text-gray-700">
              {isOnline
                ? "You are online. New orders assigned to you will appear here."
                : "Go online to become available for delivery assignments."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((order) => {
              const isTracking = trackingOrderId === order._id;

              const isUpdating = updatingOrderId === order._id;

              const orderDate = new Date(order.createdAt).toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              const customerPhone = order.customer?.phone || "";

              const phoneHref = customerPhone ? `tel:${customerPhone}` : "";

              const destCoords = order.deliveryAddress?.coordinates || null;

              const destLat = destCoords ? destCoords[1] : undefined;

              const destLng = destCoords ? destCoords[0] : undefined;

              const hasDestination =
                destLat !== undefined &&
                destLng !== undefined &&
                !(destLat === 0 && destLng === 0);

              const showMap = isTracking && currentPosition;

              const mapCenter = showMap
                ? [currentPosition.latitude, currentPosition.longitude]
                : hasDestination
                  ? [destLat, destLng]
                  : null;

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          order.restaurant?.logo ||
                          "https://via.placeholder.com/60x60?text=R"
                        }
                        alt={order.restaurant?.name || "Restaurant"}
                        className="h-12 w-12 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.restaurant?.name || "Restaurant"}
                        </p>

                        <p className="text-xs font-medium text-gray-600">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <span
                      className={
                        "whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                        (order.status === "out_for_delivery"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800")
                      }
                    >
                      {order.status === "out_for_delivery"
                        ? "Out for Delivery"
                        : "Assigned"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-700">
                    <FiMapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />

                    <div>
                      <p className="text-gray-500">Pickup from</p>

                      <p>
                        {order.restaurant?.address?.formattedAddress ||
                          "Restaurant address"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-700">
                    <FiNavigation className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />

                    <div>
                      <p className="text-gray-500">Deliver to</p>

                      <p>
                        {order.deliveryAddress?.formattedAddress ||
                          "Delivery address not available"}
                      </p>

                      {order.deliveryAddress?.instructions ? (
                        <p className="mt-1 italic text-gray-600">
                          Note: {order.deliveryAddress.instructions}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {showMap ? (
                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                      <div className="h-56 w-full">
                        <MapContainer
                          center={mapCenter}
                          zoom={15}
                          className="h-full w-full"
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />

                          <Marker
                            position={[
                              currentPosition.latitude,
                              currentPosition.longitude,
                            ]}
                            icon={scooterMarker}
                          />

                          {hasDestination ? (
                            <Marker
                              position={[destLat, destLng]}
                              icon={homeMarker}
                            />
                          ) : null}
                        </MapContainer>
                      </div>

                      <div className="flex items-center gap-1.5 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        Sharing your live location
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-700">
                    <span>{order.customer?.username || "Customer"}</span>

                    {phoneHref ? (
                      <a
                        href={phoneHref}
                        className="flex items-center gap-1 text-[#ff4d2d]"
                      >
                        <FiPhone className="h-3 w-3" />
                        {customerPhone}
                      </a>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-600">
                      <MdAccessTime className="h-3.5 w-3.5" />
                      {orderDate}
                    </span>

                    <span className="font-bold text-[#ff4d2d]">
                      Rs. {order.totalAmount}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {order.status === "assigned" ? (
                      <button
                        onClick={() => handleStartDelivery(order._id)}
                        disabled={isUpdating}
                        className="flex-1 rounded-lg bg-[#ff4d2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63e1f] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating ? "Starting..." : "Start Delivery"}
                      </button>
                    ) : null}

                    {order.status === "out_for_delivery" ? (
                      <button
                        onClick={() => handleMarkDelivered(order._id)}
                        disabled={isUpdating}
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating ? "Updating..." : "Mark Delivered"}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryBoy;
