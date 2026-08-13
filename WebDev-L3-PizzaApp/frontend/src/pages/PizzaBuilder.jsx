import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const STEPS = [
  { key: "base", field: "baseId", label: "Choose your base", multi: false },
  { key: "sauce", field: "sauceId", label: "Pick a sauce", multi: false },
  { key: "cheese", field: "cheeseId", label: "Select your cheese", multi: false },
  { key: "vegetable", field: "vegetableIds", label: "Add vegetables", multi: true },
];

export default function PizzaBuilder() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState({});
  const [itemsById, setItemsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    baseId: null,
    sauceId: null,
    cheeseId: null,
    vegetableIds: [],
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get("/inventory");
        const grouped = {};
        const lookup = {};

        response.data.forEach((item) => {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
          lookup[item._id] = item;
        });

        setInventory(grouped);
        setItemsById(lookup);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const current = STEPS[step];
  const options = inventory[current.key] || [];

  const isSelected = (itemId) => {
    if (current.multi) {
      return selections.vegetableIds.includes(itemId);
    }
    return selections[current.field] === itemId;
  };

  const handleSelect = (itemId) => {
    if (current.multi) {
      setSelections((prev) => ({
        ...prev,
        vegetableIds: prev.vegetableIds.includes(itemId)
          ? prev.vegetableIds.filter((id) => id !== itemId)
          : [...prev.vegetableIds, itemId],
      }));
    } else {
      setSelections((prev) => ({ ...prev, [current.field]: itemId }));
    }
  };

  const canProceed = current.multi || Boolean(selections[current.field]);
  const isLastStep = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      navigate("/checkout", { state: { selections, itemsById } });
    } else {
      setStep((s) => s + 1);
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-stone-500">Loading ingredients...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`h-2 flex-1 rounded-full ${
              i <= step ? "bg-orange-600" : "bg-stone-200"
            }`}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold text-stone-800 mb-1">{current.label}</h1>
      <p className="text-stone-500 text-sm mb-6">
        {current.multi ? "Select as many as you like" : "Pick one to continue"}
      </p>

      {options.length === 0 && (
        <p className="text-stone-500">No options available right now.</p>
      )}

      <div className="flex flex-col gap-2 mb-8">
        {options.map((item) => (
          <button
            key={item._id}
            onClick={() => handleSelect(item._id)}
            className={`flex justify-between items-center border rounded-lg px-4 py-3 text-left cursor-pointer transition-colors ${
              isSelected(item._id)
                ? "border-orange-600 bg-orange-50"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <span className="font-medium text-stone-800">{item.name}</span>
            <span className="text-stone-600">₹{item.price}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="px-5 py-2.5 rounded-lg text-stone-600 disabled:opacity-0 cursor-pointer transition-opacity"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isLastStep ? "Review Order" : "Next"}
        </button>
      </div>
    </div>
  );
}