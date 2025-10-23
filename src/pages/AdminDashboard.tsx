import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import api from "../api/axiosConfig";

type CartItem = {
  id: number;
  productName: string;
  productPrice: number;
  totalPrice: number;
  quantity: number;
  optionsJson: string;
};

type ShoppingCart = {
  id: number;
  createdBy: string;
  status: string;
  createdOn?: string;
  reviewedOn?: string;
  items?: CartItem[]; 
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<ShoppingCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("SUBMITTED");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const fetchOrders = async (status: string) => {
    setLoading(true);
    try {
      const url = `/cart/all?status=${status}`;
      const res = await api.get(url);
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error("Greška pri učitavanju porudžbina:", err);
      setError("Došlo je do greške pri učitavanju porudžbina.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [selectedStatus]);

  const handleStatusChange = async (cartId: number, newStatus: string) => {
    try {
      await api.post("/cart/review", {
        cartId,
        status: newStatus,
        reviewerEmail: "admin@gmail.com",
      });

      setMessage(`Status porudžbine #${cartId} uspešno promenjen na ${newStatus}.`);
      fetchOrders(selectedStatus);
    } catch (err) {
      console.error("Greška pri promeni statusa:", err);
      setMessage("Došlo je do greške pri promeni statusa.");
    }
  };

  const formatOptions = (optionsJson: string): { label: string; value: string }[] => {
    try {
      const obj = JSON.parse(optionsJson) as Record<string, string>;
      const map: Record<string, string> = {
        COLOR: "Boja",
        LENGTH: "Dužina",
        MATERIAL: "Materijal",
        SIZE: "Veličina",
      };
      return Object.entries(obj).map(([key, value]) => ({
        label: map[key.toUpperCase()] || key,
        value,
      }));
    } catch {
      return [];
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedOrderId((prev) => (prev === Number(id) ? null : Number(id)));
  };

  if (loading)
    return <p className="text-gray-300 text-center mt-10">Učitavanje porudžbina...</p>;
  if (error)
    return <p className="text-red-400 text-center mt-10">{error}</p>;

  return (
    <div className="bg-[#1e1e2f] text-gray-100 p-8 rounded-lg shadow-2xl w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center flex items-center justify-center gap-2">
        <Package size={28} />
        Admin Dashboard
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["SUBMITTED", "APPROVED", "DENIED"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-[#2a2a3d] text-gray-300 hover:bg-[#32324a]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {message && (
        <div className="text-center mb-4 flex justify-center items-center gap-2">
          <CheckCircle className="text-green-400" size={18} />
          <p className="text-green-400 font-medium">{message}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center text-gray-400">
          <AlertCircle className="mx-auto mb-2 text-blue-400" size={40} />
          <h3 className="text-2xl font-semibold text-blue-400">
            Nema porudžbina sa statusom {selectedStatus}.
          </h3>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-700 rounded-xl p-6 bg-[#2a2a3d] hover:bg-[#32324a] transition-all duration-300 shadow-md"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-300">
                    Porudžbina #{order.id}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Kreirana: {order.createdOn || "Nepoznato"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Korisnik: {order.createdBy}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        order.status === "APPROVED"
                          ? "text-green-400"
                          : order.status === "DENIED"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>

                {/* Dugmad */}
                <div className="mt-4 md:mt-0 flex gap-3 items-center">
                  <button
                    onClick={() => toggleExpand(Number(order.id))}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    {expandedOrderId === Number(order.id) ? (
                      <>
                        <ChevronUp size={18} /> Sakrij detalje
                      </>
                    ) : (
                      <>
                        <ChevronDown size={18} /> Prikaži detalje
                      </>
                    )}
                  </button>

                  <select
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    defaultValue=""
                    className="bg-[#1f2a40] border border-blue-600 text-gray-200 p-2 rounded-md"
                  >
                    <option value="" disabled>
                      Promeni status
                    </option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="DENIED">DENIED</option>
                  </select>
                </div>
              </div>

              {/* Detalji porudžbine */}
              {expandedOrderId === Number(order.id) && (
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">
                    Stavke porudžbine
                  </h4>

                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-[#1f2a40] rounded-lg mb-3 border border-gray-600"
                      >
                        <h5 className="font-semibold text-blue-300 text-lg mb-2">
                          {item.productName}
                        </h5>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {formatOptions(item.optionsJson).map((opt, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-2 bg-[#283046] px-3 py-1 rounded-full text-sm border border-gray-600 shadow-sm"
                            >
                              <span className="text-blue-300 font-medium">
                                {opt.label}:
                              </span>
                              <span className="text-gray-100">{opt.value}</span>
                            </span>
                          ))}
                        </div>

                        <p className="text-gray-300">Količina: {item.quantity}</p>
                        <p className="text-gray-300">
                          Cena po komadu: {item.productPrice.toFixed(2)} RSD
                        </p>
                        <p className="text-blue-400 font-semibold">
                          Ukupno: {item.totalPrice.toFixed(2)} RSD
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">Nema stavki u ovoj porudžbini.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
