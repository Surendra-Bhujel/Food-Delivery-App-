import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetMe from "./hooks/useGetMe";
export const serverUrl = "http://localhost:5000";

const App = () => {
  useGetMe();

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
