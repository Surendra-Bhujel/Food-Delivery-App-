import { Route, Routes, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditRestaurant from "./pages/CreateEditRestaurant";
import OwnerDashboard from "./components/OwnerDashboard";
import AddMenuItem from "./pages/AddMenuItem";

import useGetMe from "./hooks/useGetMe";
import useGetCity from "./hooks/useGetCity";
import useGetMyRestaurant from "./hooks/useGetMyRestaurant";

import { useSelector } from "react-redux";

export const serverUrl = "http://localhost:5000";

const App = () => {
  useGetMe();
  useGetCity();
  useGetMyRestaurant();

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

      {/* Create / Edit Restaurant */}
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
    </Routes>
  );
};

export default App;
