import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const RESEND_COOLDOWN = 30; // seconds

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
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // Resend OTP countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const clearMessages = () => {
    setErr("");
    setSuccess("");
  };

  const goToStep = (n) => {
    clearMessages();
    setStep(n);
  };

  const handleEmailChange = (e) => {
    clearMessages();
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    clearMessages();
    // digits only
    setOtp(e.target.value.replace(/\D/g, ""));
  };

  const handleNewPasswordChange = (e) => {
    clearMessages();
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    clearMessages();
    setConfirmPassword(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErr("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setErr("Please enter a valid email address");
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email: trimmedEmail },
        { withCredentials: true },
      );
      setEmail(trimmedEmail);
      setOtp("");
      setCooldown(RESEND_COOLDOWN);
      setStep(2);
      setSuccess(res.data?.message || "OTP sent to your email");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();

    if (!otp.trim()) {
      setErr("OTP is required");
      return;
    }
    if (otp.length !== 4) {
      setErr("OTP must be 4 digits");
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true },
      );
      setStep(3);
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    clearMessages();

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );
      setOtp("");
      setCooldown(RESEND_COOLDOWN);
      setSuccess(res.data?.message || "OTP resent to your email");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();

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

    clearMessages();
    setLoading(true);

    try {
      // otp is sent so the server can re-verify it (see backend note)
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true },
      );
      navigate("/login");
    } catch (error) {
      setErr(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) navigate("/login");
    else if (step === 2) goToStep(1);
    else goToStep(1); // OTP was already used, so restart the flow
  };

  const inputClass =
    "w-full rounded-lg px-3 py-2 focus:outline-none border-gray-200 border-[1px] focus:border-[#ff4d2d] transition-colors";
  const primaryBtnClass =
    "w-full rounded-lg py-2 text-white font-semibold cursor-pointer transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-[#ff4d2d] hover:bg-[#e63d1f] flex items-center justify-center gap-2";

  const Messages = () => (
    <>
      {err && <p className="text-red-500 text-center mt-3">* {err}</p>}
      {success && !err && (
        <p className="text-green-600 text-center mt-3">{success}</p>
      )}
    </>
  );

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoMdArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={handleBack}
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
          <form onSubmit={handleSendOtp} noValidate>
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
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <button type="submit" disabled={loading} className={primaryBtnClass}>
              {loading ? (
                <>
                  <ClipLoader color="#ffffff" size={18} />
                  <span>Sending...</span>
                </>
              ) : (
                "Send OTP"
              )}
            </button>
            <Messages />
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} noValidate>
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
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="----"
                value={otp}
                onChange={handleOtpChange}
                maxLength={4}
                className={`${inputClass} text-center text-2xl tracking-widest`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${primaryBtnClass} mb-3`}
            >
              {loading ? (
                <>
                  <ClipLoader size={18} color="#fff" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
            <Messages />

            <div className="text-center mt-3">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0}
                  className="text-[#ff4d2d] font-semibold hover:underline cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} noValidate>
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
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
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

            <button type="submit" disabled={loading} className={primaryBtnClass}>
              {loading ? (
                <>
                  <ClipLoader size={18} color="#fff" />
                  <span>Resetting...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
            <Messages />
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;