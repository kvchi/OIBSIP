import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  "Order Received": "bg-blue-500",
  "In Kitchen": "bg-amber-500",
  "Sent to Delivery": "bg-purple-500",
  Delivered: "bg-green-500",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit("join", user.id);

    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
      socket.disconnect();
    };
  }, [user.id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Welcome, {user.name}
          </h1>
          <p className="text-stone-500 text-sm">
            What would you like to order today?
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            setTimeout(() => navigate("/"), 0);
          }}
          className="px-4 py-2 border border-stone-300 rounded-lg text-sm hover:bg-stone-50"
        >
          Logout
        </button>
      </header>

      <Link
        to="/builder"
        className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg mb-8 transition-colors"
      >
        Build Your Pizza
      </Link>

      <section>
        <h2 className="text-xl font-semibold text-stone-800 mb-3">
          Your Orders
        </h2>

        {loading && <p className="text-stone-500">Loading your orders...</p>}
        {!loading && orders.length === 0 && (
          <p className="text-stone-500">You haven't placed any orders yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    statusStyles[order.orderStatus] || "bg-stone-400"
                  }`}
                >
                  {order.orderStatus}
                </span>
                <span className="font-bold text-stone-800">
                  ₹{order.totalPrice}
                </span>
              </div>
              <p className="text-stone-500 text-sm">
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-stone-700">
                Payment: <strong>{order.paymentStatus}</strong>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
