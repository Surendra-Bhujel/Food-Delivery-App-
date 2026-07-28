import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  // Remove formData entirely

  const handleEmailChange = (e) => {
    setErr("");
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setErr("");
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setErr("");
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setErr("");
    setConfirmPassword(e.target.value);
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErr("Email is required");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );
      setErr(res.data.message);

      setStep(2);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErr("OTP is required");
      return;
    }

    if (otp.length !== 4) {
      setErr("OTP must be 4 digits");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        },
      );

      setStep(3);
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP");
    }finally{
        setLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setErr("");

    try {
      await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setErr("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        {
          withCredentials: true,
        },
      );

      navigate("/login");
    } catch (error) {
      setErr(error.response?.data?.message || "Password reset failed");
    }finally{
        setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoMdArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => {
              if (step === 1) navigate("/login");
              else if (step === 2) setStep(1);
              else setStep(2);
            }}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            {step === 1
              ? "Forgot Password"
              : step === 2
                ? "Verify OTP"
                : "New Password"}
          </h1>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full rounded-lg px-3 py-2 focus:outline-none border-gray-200 border-[1px] focus:border-[#ff4d2d] transition-colors"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full rounded-lg py-2 text-white font-semibold cursor-pointer transition duration-200 disabled:opacity-60 bg-[#ff4d2d] hover:bg-[#e63d1f]"
            >
              Send OTP
            </button>
            {err && <p className="text-red-500 text-center mt-3">* {err}</p>}
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div>
            <div className="mb-2">
              <p className="text-gray-600 text-sm text-center">
                We've sent a verification code to
              </p>
              <p className="text-gray-800 font-medium text-center">{email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                maxLength="4"
                required
                className="w-full rounded-lg px-3 py-2 focus:outline-none border-gray-200 border-[1px] focus:border-[#ff4d2d] transition-colors text-center text-2xl tracking-widest"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full rounded-lg py-2 text-white font-semibold cursor-pointer transition duration-200 disabled:opacity-60 bg-[#ff4d2d] hover:bg-[#e63d1f] mb-3"
            >
              Verify OTP
            </button>
            {err && <p className="text-red-500 text-center mt-3">* {err}</p>}

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  className="text-[#ff4d2d] font-semibold hover:underline cursor-pointer"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div>
            <div className="mb-2">
              <p className="text-gray-600 text-sm text-center">
                Create a new password for your account
              </p>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                  className="w-full rounded-lg px-3 py-2 focus:outline-none border-gray-200 border-[1px] focus:border-[#ff4d2d] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className="w-full rounded-lg px-3 py-2 focus:outline-none border-gray-200 border-[1px] focus:border-[#ff4d2d] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <IoEye size={20} />
                  ) : (
                    <IoEyeOff size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full rounded-lg py-2 text-white font-semibold cursor-pointer transition duration-200 disabled:opacity-60 bg-[#ff4d2d] hover:bg-[#e63d1f]"
            >
              Reset Password
            </button>
            {err && <p className="text-red-500 text-center mt-3">* {err}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
