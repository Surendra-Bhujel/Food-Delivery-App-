import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import useGetMe from "./hooks/useGetMe";
import useGetCity from "./hooks/useGetCity";
import { useSelector } from "react-redux";

export const serverUrl = "http://localhost:5000";

const App = () => {
  useGetMe();
  useGetCity();

  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        path="/register"
        element={!userData ? <Register /> : <Navigate to="/" />}
      />

      <Route
        path="/login"
        element={!userData ? <LogIn /> : <Navigate to="/" />}
      />

      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;