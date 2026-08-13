import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const { selections, itemsById } = location.state || {};

  if (!selections) {
    return <Navigate to="/builder" replace />;
  }

  const base = itemsById[selections.baseId];
  const sauce = itemsById[selections.sauceId];
  const cheese = itemsById[selections.cheeseId];
  const vegetables = selections.vegetableIds.map((id) => itemsById[id]);

  const total =
    base.price + sauce.price + cheese.price + vegetables.reduce((sum, v) => sum + v.price, 0);

  const handlePayment = async () => {
    setError("");
    setProcessing(true);

    try {
      const orderRes = await api.post("/orders", {
        items: [
          {
            baseId: selections.baseId,
            sauceId: selections.sauceId,
            cheeseId: selections.cheeseId,
            vegetableIds: selections.vegetableIds,
            quantity: 1,
          },
        ],
      });
      const newOrder = orderRes.data.order;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Unable to load payment gateway. Check your connection.");
        setProcessing(false);
        return;
      }

      const razorpayRes = await api.post("/payments/create-razorpay-order", {
        orderId: newOrder._id,
      });
      const { razorpayOrderId, amount, currency, keyId } = razorpayRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Pizza Delivery App",
        description: "Your custom pizza",
        order_id: razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        handler: async (response) => {
          try {
            await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: newOrder._id,
            });
            navigate("/dashboard");
          } catch (err) {
            console.error("Payment verification failed:", err)
            setError("Payment succeeded but verification failed. Contact support.");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
        theme: {
          color: "#ea580c",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Review your order</h1>

      <div className="bg-white border border-stone-200 rounded-lg p-5 mb-6">
        <div className="flex justify-between py-2 border-b border-stone-100">
          <span className="text-stone-600">Base</span>
          <span className="font-medium">{base.name} — ₹{base.price}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-stone-100">
          <span className="text-stone-600">Sauce</span>
          <span className="font-medium">{sauce.name} — ₹{sauce.price}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-stone-100">
          <span className="text-stone-600">Cheese</span>
          <span className="font-medium">{cheese.name} — ₹{cheese.price}</span>
        </div>
        <div className="py-2 border-b border-stone-100 flex justify-between">
          <span className="text-stone-600">Vegetables</span>
          {vegetables.length === 0 ? (
            <p className="text-stone-400 text-sm mt-1">None selected</p>
          ) : (
            vegetables.map((v) => (
              <div key={v._id} className=" text-sm mt-1">
                <span className="">{v.name}</span>
                <span> — ₹{v.price}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between pt-3 text-lg font-bold text-stone-800">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {processing ? "Processing..." : `Pay ₹${total} Now`}
      </button>
    </div>
  );
}