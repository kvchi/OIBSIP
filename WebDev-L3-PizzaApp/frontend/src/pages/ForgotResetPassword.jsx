import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotResetPassword() {
  const { token } = useParams();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        {token ? (
          <>
            <h1 className="text-2xl font-bold text-stone-800 mb-1">Reset your password</h1>
            <p className="text-stone-500 text-sm mb-6">Enter a new password below.</p>
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg mt-2 transition-colors"
              >
                Reset Password
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-stone-800 mb-1">Forgot password</h1>
            <p className="text-stone-500 text-sm mb-6">We'll email you a link to reset it.</p>
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg mt-2 transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}

        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <p className="mt-6 text-center text-sm text-stone-500">
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}