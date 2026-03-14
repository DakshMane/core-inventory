import { useNavigate } from "react-router-dom";
import { receiptsApi } from "../receiptsApi";
import ReceiptForm from "../components/ReceiptForm";
import { useToast } from "../../../hooks/useToast";
import { useState } from "react";

export default function ReceiptFormPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(form) {
    setLoading(true);
    try {
      await receiptsApi.create(form);
      toast.success("Receipt created!");
      navigate("/receipts");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">New Receipt</h2>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ReceiptForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
