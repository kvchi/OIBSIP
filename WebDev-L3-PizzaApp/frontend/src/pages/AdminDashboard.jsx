import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORY_LABELS = {
  base: "Bases",
  sauce: "Sauces",
  cheese: "Cheeses",
  vegetable: "Vegetables",
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0)

  const fetchInventory = async () => {
    try {
      const response = await api.get("/inventory");
      setItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get("/inventory");
        setItems(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, [refetchIndex]);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditStock(String(item.stock));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStock("");
  };

  const saveStock = async (id) => {
    setSavingId(id);
    try {
      await api.patch(`/inventory/${id}`, { stock: Number(editStock) });
      await fetchInventory();
      setEditingId(null);
      setRefetchIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Inventory</h1>
          <p className="text-stone-500 text-sm">Manage stock levels for all ingredients</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/orders"
            className="px-4 py-2 border border-stone-300 rounded-lg text-sm hover:bg-stone-50"
          >
            Orders
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 border border-stone-300 rounded-lg text-sm hover:bg-stone-50"
          >
            Logout
          </button>
        </div>
      </header>

      {loading && <p className="text-stone-500">Loading inventory...</p>}

      {Object.entries(grouped).map(([category, categoryItems]) => (
        <section key={category} className="mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-2">
            {CATEGORY_LABELS[category] || category}
          </h2>
          <div className="flex flex-col gap-2">
            {categoryItems.map((item) => {
              const isLow = item.stock < item.lowStockThreshold;
              const isEditing = editingId === item._id;

              return (
                <div
                  key={item._id}
                  className={`flex justify-between items-center bg-white border rounded-lg p-3 ${
                    isLow ? "border-red-300" : "border-stone-200"
                  }`}
                >
                  <div>
                    <p className="font-medium text-stone-800">{item.name}</p>
                    <p className="text-sm text-stone-500">
                      ₹{item.price} · threshold {item.lowStockThreshold}
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-20 border border-stone-300 rounded-lg px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => saveStock(item._id)}
                        disabled={savingId === item._id}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        {savingId === item._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-sm text-stone-500 hover:text-stone-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${isLow ? "text-red-600" : "text-stone-800"}`}
                      >
                        {item.stock} in stock
                      </span>
                      <button
                        onClick={() => startEdit(item)}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}