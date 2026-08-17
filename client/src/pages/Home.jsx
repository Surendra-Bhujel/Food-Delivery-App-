import { useSelector } from "react-redux";

import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoy from "./DeliveryBoy";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff4d2d]/20 border-t-[#ff4d2d]" />

        <p className="text-sm font-medium text-gray-600">
          Loading...
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  const { userData, authLoading } = useSelector(
    (state) => state.user
  );

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!userData) {
    return null;
  }

  const role = String(userData.role || "")
    .trim()
    .toLowerCase();

  if (
    role === "customer" ||
    role === "user"
  ) {
    return <UserDashboard />;
  }

  if (
    role === "owner" ||
    role === "restaurant_owner"
  ) {
    return <OwnerDashboard />;
  }

  if (
    role === "rider" ||
    role === "delivery_boy" ||
    role === "deliveryboy"
  ) {
    return <DeliveryBoy />;
  }

  return (
    <LoadingScreen />
  );
};

export default Home;