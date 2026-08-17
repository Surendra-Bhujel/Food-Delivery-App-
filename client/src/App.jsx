import { Route, Routes, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditRestaurant from "./pages/CreateEditRestaurant";
import OwnerDashboard from "./components/OwnerDashboard";
import AddMenuItem from "./pages/AddMenuItem";
import EditItem from "./pages/EditItem";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";

import useGetMe from "./hooks/useGetMe";
import useGetCity from "./hooks/useGetCity";
import useGetMyRestaurant from "./hooks/useGetMyRestaurant";
import useGetCart from "./hooks/useGetCart";

import { useSelector } from "react-redux";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OwnerOrders from "./components/OwnerOrderCard";
import DeliveryBoy from "./components/DeliveryBoy";

export const serverUrl = "http://localhost:5000";

const App = () => {
  useGetMe();
  useGetCity();
  useGetMyRestaurant();
  useGetCart();

  const { userData } = useSelector((state) => state.user);
  const { restaurant } = useSelector((state) => state.owner);

  return (
    <Routes>
      {/* Register */}
      <Route
        path="/register"
        element={!userData ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={!userData ? <LogIn /> : <Navigate to="/" replace />}
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" replace />}
      />

      {/* Home */}
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" replace />}
      />

      {/* Restaurant Detail */}
      <Route
        path="/restaurant/:id"
        element={
          userData ? <RestaurantDetail /> : <Navigate to="/login" replace />
        }
      />

      {/* Cart */}
      <Route
        path="/cart"
        element={
          userData?.role === "customer" ? <Cart /> : <Navigate to="/" replace />
        }
      />

      {/* Owner Dashboard */}
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

      {/* Create Restaurant */}
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

      {/* Edit Restaurant */}
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

      {/* Add Menu Item */}
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

      {/* Edit Menu Item */}
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
      {/* Checkout */}
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
      {/* My Orders */}
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
      {/* Owner Orders */}
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
      {/* Delivery Boy Dashboard */}
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
    </Routes>
  );
};

export default App;
