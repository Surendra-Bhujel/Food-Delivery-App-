import { useState } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const Register = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setErr("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("handleSubmit called");

    try {
      if (!formData.phone.trim()) {
        setErr("Phone number is required");
        return;
      }

      if (!/^\d{10}$/.test(formData.phone)) {
        setErr("Phone number must be exactly 10 digits");
        return;
      }

      if (formData.password.length < 6) {
        setErr("Password must be at least 6 characters long");
        return;
      }

      setErr("");
      const res = await axios.post(`${serverUrl}/api/auth/register`, formData, {
        withCredentials: true,
      });

      console.log(res.data);
      setErr("");

      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!formData.phone.trim()) {
      setErr("Phone number is required");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setErr("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role: formData.role,
          phone: formData.phone,
          googleId: result.user.uid,
        },
        {
          withCredentials: true,
        },
      );

      console.log(data);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Google Sign-In failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          MithoDelivery
        </h1>

        <p className="text-gray-600 mb-8">
          Create your account to get started with delicious food deliveries
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter your Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 focus:outline-none"
              style={{ border: `1px solid ${borderColor}` }}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 focus:outline-none"
              style={{ border: `1px solid ${borderColor}` }}
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 focus:outline-none"
              style={{ border: `1px solid ${borderColor}` }}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
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
                className="w-full rounded-lg px-3 py-2 focus:outline-none"
                style={{ border: `1px solid ${borderColor}` }}
              />

              <button
                type="button"
                className="absolute right-3 top-[13px] text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Role</label>

            <div className="flex gap-2">
              {["customer", "owner", "rider"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: r,
                    })
                  }
                  className="flex-1 rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                  style={
                    formData.role === r
                      ? {
                          backgroundColor: primaryColor,
                          color: "white",
                        }
                      : {
                          border: `1px solid ${primaryColor}`,
                          color: primaryColor,
                        }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 text-white font-semibold  cursor-pointer transition duration-200 disabled:opacity-60"
            style={{
              backgroundColor: loading ? "#bdbdbd" : primaryColor,
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = hoverColor;
            }}
            onMouseOut={(e) => {
              if (!loading)
                e.currentTarget.style.backgroundColor = primaryColor;
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="text-red-500 text-center my-[10px]"> * {err}</p>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 disabled:opacity-60"
        >
          <FcGoogle size={20} />
          <span>{loading ? "Please wait..." : "Register with Google"}</span>
        </button>

        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account?{" "}
          <span style={{ color: primaryColor }}>Log In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
