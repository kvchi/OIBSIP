import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-stone-800 mb-2">404</h1>
      <p className="text-stone-500 mb-6">This page doesn't exist.</p>
      <Link
        to="/dashboard"
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}