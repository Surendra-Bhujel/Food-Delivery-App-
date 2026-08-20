import { useState } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const LogIn = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#cbd5e1";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setErr("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setErr("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setErr("Password must be at least 6 characters long");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        formData,
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      console.log("LOGIN RESPONSE:", response.data);

      const loggedInUser = response.data?.user || response.data?.data || null;

      if (!loggedInUser) {
        throw new Error("User data was not returned by the server");
      }

      dispatch(setUserData(loggedInUser));

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      setErr(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErr("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const response = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
          googleId: result.user.uid,
        },
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      console.log("GOOGLE LOGIN RESPONSE:", response.data);

      const loggedInUser = response.data?.user || response.data?.data || null;

      if (!loggedInUser) {
        throw new Error("User data was not returned by the server");
      }

      dispatch(setUserData(loggedInUser));

      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Google login error:",
        error.response?.data || error.message,
      );

      setErr(
        error.response?.data?.message ||
          error.message ||
          "Google Sign-In failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 bg-white p-8 shadow-2xl"
        style={{ borderColor }}
      >
        <h1 className="mb-2 text-3xl font-bold" style={{ color: primaryColor }}>
          MithoDelivery
        </h1>

        <p className="mb-8 text-gray-600">
          Log In to your account to get started with delicious food deliveries
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 outline-none"
              style={{
                border: `1px solid ${borderColor}`,
              }}
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg px-3 py-2 outline-none"
                style={{
                  border: `1px solid ${borderColor}`,
                }}
              />

              <button
                type="button"
                className="absolute right-3 top-[13px] cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          <div
            className="mb-4 cursor-pointer text-right font-medium"
            style={{ color: primaryColor }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2 font-semibold text-white transition duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: loading ? "#bdbdbd" : primaryColor,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = hoverColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = primaryColor;
              }
            }}
          >
            {loading ? (
              <>
                <ClipLoader color="#ffffff" size={18} />
                <span>Logging In...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {err && (
          <p className="mt-3 text-center font-medium text-red-500">* {err}</p>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleAuth}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-400 px-4 py-2 transition duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <ClipLoader size={18} color="#ff4d2d" />
              <span>Please wait...</span>
            </>
          ) : (
            <>
              <FcGoogle size={20} />
              <span>Log In with Google</span>
            </>
          )}
        </button>

        <p
          className="mt-6 cursor-pointer text-center"
          onClick={() => navigate("/register")}
        >
          Don't have an account?{" "}
          <span style={{ color: primaryColor }}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
