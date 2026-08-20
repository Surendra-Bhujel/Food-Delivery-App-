import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";

import CreateEditRestaurant from "./pages/CreateEditRestaurant";
import OwnerDashboard from "./components/OwnerDashboard";
import AddMenuItem from "./pages/AddMenuItem";
import EditItem from "./pages/EditItem";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import OwnerOrders from "./components/OwnerOrders";
import DeliveryBoy from "./pages/DeliveryBoy";

import useGetMe from "./hooks/useGetMe";
import useGetCity from "./hooks/useGetCity";
import useGetMyRestaurant from "./hooks/useGetMyRestaurant";
import useGetCart from "./hooks/useGetCart";
import OrderTracking from "./pages/OrderTracking";

export const serverUrl = "http://localhost:5000";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff4d2d]/20 border-t-[#ff4d2d]" />

        <p className="text-sm font-medium text-gray-600">
          Checking your session...
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const { loading: authLoading } = useGetMe();

  useGetCity();
  useGetMyRestaurant();
  useGetCart();

  const { userData } = useSelector((state) => state.user);
  const { restaurant } = useSelector((state) => state.owner);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={userData ? <Home /> : <LandingPage />} />

      <Route
        path="/register"
        element={userData ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        path="/login"
        element={userData ? <Navigate to="/" replace /> : <LogIn />}
      />

      <Route
        path="/forgot-password"
        element={userData ? <Navigate to="/" replace /> : <ForgotPassword />}
      />

      <Route
        path="/restaurant/:id"
        element={
          userData ? <RestaurantDetail /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/cart"
        element={
          userData?.role === "customer" ? <Cart /> : <Navigate to="/" replace />
        }
      />

      <Route
        path="/checkout"
        element={
          userData?.role === "customer" ? (
            <Checkout />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/my-orders"
        element={
          userData?.role === "customer" ? (
            <MyOrders />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/owner-dashboard"
        element={
          userData?.role === "owner" ? (
            <OwnerDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/create-restaurant"
        element={
          userData?.role === "owner" ? (
            <CreateEditRestaurant />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/edit-restaurant/:id"
        element={
          userData?.role === "owner" && restaurant ? (
            <CreateEditRestaurant />
          ) : (
            <Navigate to="/owner-dashboard" replace />
          )
        }
      />

      <Route
        path="/add-menu-item"
        element={
          userData?.role === "owner" && restaurant ? (
            <AddMenuItem />
          ) : (
            <Navigate to="/owner-dashboard" replace />
          )
        }
      />

      <Route
        path="/edit-menu-item/:id"
        element={
          userData?.role === "owner" && restaurant ? (
            <EditItem />
          ) : (
            <Navigate to="/owner-dashboard" replace />
          )
        }
      />

      <Route
        path="/owner-orders"
        element={
          userData?.role === "owner" ? (
            <OwnerOrders />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/delivery-dashboard"
        element={
          userData?.role === "rider" ? (
            <DeliveryBoy />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/orders/:id/track"
        element={
          userData ? <OrderTracking /> : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
