import { useEffect, useState, useMemo } from "react";
import {
  Package,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  SortAsc,
  SortDesc,
} from "lucide-react";
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
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    setCurrentPage(1);
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
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdOn || "").getTime();
      const dateB = new Date(b.createdOn || "").getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [orders, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return <p className="text-gray-300 text-center mt-10">Učitavanje porudžbina...</p>;
  if (error)
    return <p className="text-red-400 text-center mt-10">{error}</p>;

  return (
    <div className="bg-gradient-to-b from-[#0b1320] to-[#1b263b] text-gray-100 min-h-screen py-12 px-6">
      {/* HEADER */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <Package size={34} className="text-sky-400" />
        <h2 className="text-4xl font-bold text-sky-400 tracking-wide">
          ADMIN DASHBOARD
        </h2>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <div className="flex gap-3">
          {["SUBMITTED", "APPROVED", "DENIED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${
                selectedStatus === status
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-800/40 scale-105"
                  : "bg-[#1f2a40] text-gray-300 hover:bg-[#243b55]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1f2a40] text-gray-300 hover:bg-[#243b55] transition"
        >
          {sortOrder === "desc" ? (
            <>
              <SortDesc size={18} className="text-sky-400" /> Najnovije
            </>
          ) : (
            <>
              <SortAsc size={18} className="text-sky-400" /> Najstarije
            </>
          )}
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="text-center mb-6 flex justify-center items-center gap-2 animate-fade-in">
          <CheckCircle className="text-green-400" size={18} />
          <p className="text-green-400 font-medium">{message}</p>
        </div>
      )}

      {/* ORDERS */}
      {currentOrders.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <AlertCircle className="mx-auto mb-3 text-sky-400" size={42} />
          <h3 className="text-2xl font-semibold text-sky-400">
            Nema porudžbina sa statusom {selectedStatus}.
          </h3>
        </div>
      ) : (
        <div className="space-y-8 max-w-6xl mx-auto">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1b2436]/80 border border-[#243b55] backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-sky-800/20 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-sky-300">
                    Porudžbina #{order.id}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Kreirana: {order.createdOn || "Nepoznato"}
                  </p>
                  <p className="text-gray-400 text-sm">Korisnik: {order.createdBy}</p>
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

                <div className="mt-4 md:mt-0 flex flex-wrap gap-3 items-center">
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition"
                  >
                    {expandedOrderId === order.id ? (
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
                    className="bg-[#1f2a40] border border-sky-700 text-gray-200 p-2 rounded-lg"
                  >
                    <option value="" disabled>
                      Promeni status
                    </option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="DENIED">DENIED</option>
                  </select>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="mt-6 border-t border-gray-700 pt-5 space-y-4">
                  <h4 className="text-lg font-semibold text-sky-400 mb-3">
                    Stavke porudžbine
                  </h4>

                  {order.items && order.items.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 bg-[#1f2a40] rounded-xl border border-[#2c3e55] hover:border-sky-600 transition"
                        >
                          <h5 className="font-semibold text-sky-300 text-lg mb-2">
                            {item.productName}
                          </h5>
                          <p className="text-gray-300 text-sm">
                            Količina: {item.quantity}
                          </p>
                          <p className="text-gray-300 text-sm">
                            Cena po komadu: {item.productPrice.toFixed(2)} RSD
                          </p>
                          <p className="text-sky-400 font-semibold">
                            Ukupno: {item.totalPrice.toFixed(2)} RSD
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      Nema stavki u ovoj porudžbini.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === 1
                ? "bg-[#1f2a40] text-gray-500 cursor-not-allowed"
                : "bg-sky-700 hover:bg-sky-800 text-white"
            }`}
          >
            <ArrowLeft size={16} /> Prethodna
          </button>

          <span className="text-gray-300">
            Stranica {currentPage} od {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === totalPages
                ? "bg-[#1f2a40] text-gray-500 cursor-not-allowed"
                : "bg-sky-700 hover:bg-sky-800 text-white"
            }`}
          >
            Sledeća <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
