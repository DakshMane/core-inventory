import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deliveriesApi } from "../deliveriesApi";
import { productsApi } from "../../products/productsApi";
import DeliveryForm from "../components/DeliveryForm";
import { useToast } from "../../../hooks/useToast";

export default function DeliveryFormPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsApi
      .getAll()
      .then((r) => setProducts(r.data?.data ?? r.data ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(form) {
    setLoading(true);
    try {
      await deliveriesApi.create(form);
      toast.success("Delivery order created!");
      navigate("/deliveries");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold text-gray-900">
        New Delivery Order
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <DeliveryForm
          onSubmit={handleSubmit}
          loading={loading}
          products={products}
        />
      </div>
    </div>
  );
}
