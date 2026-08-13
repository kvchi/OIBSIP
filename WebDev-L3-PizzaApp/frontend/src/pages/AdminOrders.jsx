import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];

const statusStyles = {
  "Order Received": "bg-blue-500",
  "In Kitchen": "bg-amber-500",
  "Sent to Delivery": "bg-purple-500",
  "Delivered": "bg-green-500",
};

export default function AdminOrders() {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data.order : order))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Orders</h1>
          <p className="text-stone-500 text-sm">Update status as orders progress</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin"
            className="px-4 py-2 border border-stone-300 rounded-lg text-sm hover:bg-stone-50"
          >
            Inventory
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 border border-stone-300 rounded-lg text-sm hover:bg-stone-50"
          >
            Logout
          </button>
        </div>
      </header>

      {loading && <p className="text-stone-500">Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-stone-500">No orders yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-stone-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-stone-800">{order.user?.name}</p>
                <p className="text-xs text-stone-500">{order.user?.email}</p>
              </div>
              <span className="font-bold text-stone-800">₹{order.totalPrice}</span>
            </div>

            <p className="text-xs text-stone-500 mb-3">
              {new Date(order.createdAt).toLocaleString()} · Payment:{" "}
              <strong>{order.paymentStatus}</strong>
            </p>

            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  statusStyles[order.orderStatus] || "bg-stone-400"
                }`}
              >
                {order.orderStatus}
              </span>

              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                disabled={updatingId === order._id}
                className="border border-stone-300 rounded-lg px-2 py-1 text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}