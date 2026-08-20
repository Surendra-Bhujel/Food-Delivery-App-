import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { socket } from "../socket";

const useOrderTracking = (orderId) => {
  const { userData } = useSelector((state) => state.user);

  const [liveStatus, setLiveStatus] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    if (!orderId || !userData?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_order_room", {
      orderId,
      role: userData.role,
      userId: userData._id,
    });

    const handleStatusUpdate = (payload) => {
      if (payload.orderId === orderId) {
        setLiveStatus(payload);
      }
    };

    // Normalizes two possible location payload shapes:
    // - from socketHandler.js on join: { orderId, coordinates: [lng, lat], timestamp }
    // - from riderController.js on REST location POST:
    //   { orderId, latitude, longitude, timestamp }
    const handleLocationUpdate = (payload) => {
      if (payload.orderId !== orderId) return;

      if (Array.isArray(payload.coordinates)) {
        const [longitude, latitude] = payload.coordinates;
        setRiderLocation({ latitude, longitude, timestamp: payload.timestamp });
      } else if (
        payload.latitude !== undefined &&
        payload.longitude !== undefined
      ) {
        setRiderLocation({
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: payload.timestamp,
        });
      }
    };

    socket.on("order:status_update", handleStatusUpdate);
    socket.on("rider:location", handleLocationUpdate);
    socket.on("rider:location_update", handleLocationUpdate);
    socket.on("error", (err) => console.error("Socket error:", err));

    return () => {
      socket.emit("leave_order_room", { orderId });
      socket.off("order:status_update", handleStatusUpdate);
      socket.off("rider:location", handleLocationUpdate);
      socket.off("rider:location_update", handleLocationUpdate);
    };
  }, [orderId, userData]);

  return { liveStatus, riderLocation };
};

export default useOrderTracking;
