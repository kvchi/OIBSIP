import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        setMessage(response.data.message);
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.message || err.message);
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">Email Verification</h1>

        {status === "verifying" && <p className="text-stone-500">Verifying your email...</p>}

        {status === "success" && (
          <>
            <p className="text-green-600 mb-4">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && <p className="text-red-600">{message}</p>}
      </div>
    </div>
  );
}