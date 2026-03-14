import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../dashboardApi";
import { ROUTES } from "../../../routes/routes";
import Spinner from "../../../components/ui/Spinner";
import ProductList from "../../products/components/ProductList";
import { productsApi } from "../../products/productsApi";
export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productsApi
      .getAll({ search })
      .then((r) => {
        const prodData = r.data.data || [];
        const mapped = prodData.map((p) => ({
          id: p._id,
          sku: p.sku,
          name: p.name,
          category: p.category?.name || p.category,
          uom: p.unitOfMeasure,
          qty: p.totalStock,
          status:
            p.totalStock > (p.reorderLevel || 0) ? "in-stock" : "low-stock",
        }));
        setProducts(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  const navigate = useNavigate();
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await dashboardApi.getDashboard();
        setKpis(res.data.data?.kpis || {});
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" color="red" />
      </div>
    );

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <div className="flex gap-6 max-w-5xl">
        {/* RECEIPT CARD */}
        <div
          onClick={() => navigate(ROUTES.RECEIPTS)}
          className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl group-hover:w-1.5 transition-all" />
          <h2 className="text-gray-800 text-lg font-bold ml-2">Receipts</h2>

          <div className="flex justify-between items-end ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.RECEIPTS);
              }}
              className="border border-blue-200 bg-blue-50 text-blue-700 rounded-lg px-5 py-2.5 font-semibold text-sm hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
            >
              {kpis.pendingReceipts || 0} TO RECEIVE
            </button>

            <div className="text-gray-500 text-sm space-y-1.5 text-right font-medium">
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Late</span>{" "}
                <span className="text-red-500 font-semibold">
                  {kpis.lateReceipts || 0}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Total Ops</span>{" "}
                <span className="text-gray-700">
                  {kpis.totalReceiptOps || 0}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* DELIVERY CARD */}
        <div
          onClick={() => navigate(ROUTES.DELIVERIES)}
          className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl group-hover:w-1.5 transition-all" />
          <h2 className="text-gray-800 text-lg font-bold ml-2">
            Delivery Orders
          </h2>

          <div className="flex justify-between items-end ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.DELIVERIES);
              }}
              className="border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg px-5 py-2.5 font-semibold text-sm hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
            >
              {kpis.pendingDeliveries || 0} TO DELIVER
            </button>

            <div className="text-gray-500 text-sm space-y-1.5 text-right font-medium">
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Late</span>{" "}
                <span className="text-red-500 font-semibold">
                  {kpis.lateDeliveries || 0}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Waiting</span>{" "}
                <span className="text-orange-500 font-semibold">
                  {kpis.waitingDeliveries || 0}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Total Ops</span>{" "}
                <span className="text-gray-700">
                  {kpis.totalDeliveryOps || 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ProductList
        data={products}
        style={{ marginTop: "2rem", width: "80%", marginInline: "auto" }}
      />
    </div>
  );
}
