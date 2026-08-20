import { useEffect, useState } from "react";

import { socket } from "../socket";

const useOrderTracking = (orderId) => {
  const [liveStatus, setLiveStatus] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_order_room", orderId);

    const handleStatusUpdate = (payload) => {
      if (payload.orderId === orderId) {
        setLiveStatus(payload);
      }
    };

    const handleLocationUpdate = (payload) => {
      if (payload.orderId === orderId) {
        setRiderLocation({
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: payload.timestamp,
        });
      }
    };

    socket.on("order:status_update", handleStatusUpdate);
    socket.on("rider:location_update", handleLocationUpdate);

    return () => {
      socket.emit("leave_order_room", orderId);
      socket.off("order:status_update", handleStatusUpdate);
      socket.off("rider:location_update", handleLocationUpdate);
    };
  }, [orderId]);

  return { liveStatus, riderLocation };
};

export default useOrderTracking;
