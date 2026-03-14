import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi } from "../productsApi";
import ProductForm from "../components/ProductForm";
import { useToast } from "../../../hooks/useToast";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [initial, setInitial] = useState({});
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([productsApi.getCategories(), productsApi.getLocations()]).then(
      ([catRes, locRes]) => {
        setCategories(catRes.data.data || []);
        setLocations(locRes.data.data || []);
      },
    );

    if (isEdit) {
      productsApi.getOne(id).then((r) => {
        const d = r.data.data;
        if (d)
          setInitial({
            ...d,
            uom: d.unitOfMeasure,
            category: d.category?._id || d.category,
          });
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(form) {
    setLoading(true);
    try {
      // Map UI state back to the backend payload keys
      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        unitOfMeasure: form.uom,
        reorderLevel: form.reorderLevel || 0,
      };

      // Only send initial stock if it's new and location is selected
      if (!isEdit && form.initialQty > 0 && form.location) {
        payload.initialStock = form.initialQty;
        payload.location = form.location;
      }

      isEdit
        ? await productsApi.update(id, payload)
        : await productsApi.create(payload);
      toast.success(`Product ${isEdit ? "updated" : "created"}!`);
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {isEdit ? "Edit Product" : "New Product"}
      </h2>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm
          initial={initial}
          categories={categories}
          locations={locations}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
