import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="flex justify-between items-center max-w-5xl mx-auto px-6 py-5">
        <span className="text-xl font-bold text-stone-800">🍕 Pizza Delivery App</span>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto text-center px-6 pt-16 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4">
          Build your perfect pizza.
        </h1>
        <p className="text-lg text-stone-500 mb-8">
          Pick your base, sauce, cheese, and toppings — track it from the oven to your door, in real time.
        </p>
        <Link
          to="/register"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3.5 rounded-lg text-lg transition-colors"
        >
          Order Now
        </Link>
      </section>

      <section className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 px-6 pb-20">
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
          <p className="text-3xl mb-2">🍕</p>
          <h3 className="font-semibold text-stone-800 mb-1">Build it your way</h3>
          <p className="text-sm text-stone-500">Four steps, endless combinations.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
          <p className="text-3xl mb-2">💳</p>
          <h3 className="font-semibold text-stone-800 mb-1">Pay securely</h3>
          <p className="text-sm text-stone-500">Fast, safe checkout at every order.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
          <p className="text-3xl mb-2">🚚</p>
          <h3 className="font-semibold text-stone-800 mb-1">Track it live</h3>
          <p className="text-sm text-stone-500">Watch your order move from kitchen to door.</p>
        </div>
      </section>
    </div>
  );
}