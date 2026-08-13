import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const user = await login(email, password);
            if (user.role !== "admin") {
                setError("This login is for administrators only.");
                return;
            }
            navigate("/admin");
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };
    return(
        <div className="min-h-screen flex items-center justify-center px-4 bg-stone-900">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-1">Admin Login</h1>
        <p className="text-stone-500 text-sm mb-6">Restricted access</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-stone-800 hover:bg-stone-900 text-white font-semibold py-2.5 rounded-lg mt-2 transition-colors"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
    );
}