import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  ShoppingCart,
  FileClock,
  ClipboardList,
} from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";
import api from "../api/axiosConfig";

type ShoppingCart = {
  id: number;
  createdOn: string;
  createdBy: UserEntity;
  status: string;
  reviewedOn?: string | null;
  reviewedBy?: string | null;
  items?: CartItem[];
};

type UserEntity = {};

type CartItem = {
  id?: number;
  productName: string;
  productPrice: number;
  totalPrice: number;
  quantity: number;
  optionsJson: string;
};

const OrderDashboard = () => {
  const [orders, setOrders] = useState<ShoppingCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "ACTIVE" | "SUBMITTED" | "REVIEWED"
  >("SUBMITTED");
  const [selectedOrder, setSelectedOrder] = useState<ShoppingCart | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/cart/user`);
        setOrders(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju narudžbina:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (activeTab === "ACTIVE") return o.status === "ACTIVE";
    if (activeTab === "SUBMITTED") return o.status === "SUBMITTED";
    return o.status !== "ACTIVE" && o.status !== "SUBMITTED";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-900/30";
      case "SUBMITTED":
        return "text-yellow-300 bg-yellow-900/30";
      case "APPROVED":
        return "text-blue-400 bg-blue-900/30";
      case "REJECTED":
        return "text-red-400 bg-red-900/30";
      default:
        return "text-gray-400 bg-gray-700/30";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("sr-RS", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const handleShowDetails = async (cartId: number) => {
    try {
      const res = await api.get(`/cart/${cartId}`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju detalja porudžbine:", err);
      alert("Nije moguće učitati detalje porudžbine.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-blue-100 py-12 px-6">
      <div className="flex justify-center items-center gap-3 mb-10">
        <ClipboardList size={38} className="text-sky-400" />
        <h2 className="text-4xl font-bold text-sky-400 tracking-wide">
          MOJE NARUDŽBINE
        </h2>
      </div>

      <div className="max-w-6xl mx-auto bg-[#1b263b] rounded-2xl shadow-lg p-8 border border-[#243b55]">
        <div className="flex justify-center mb-8 space-x-4">
          {["ACTIVE", "SUBMITTED", "REVIEWED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-[#0f1e33] hover:bg-[#1e2e44] text-blue-200"
              }`}
            >
              {tab === "ACTIVE" && (
                <>
                  <FileClock size={16} /> Aktivne
                </>
              )}
              {tab === "SUBMITTED" && (
                <>
                  <ShoppingCart size={16} /> Poslate
                </>
              )}
              {tab === "REVIEWED" && (
                <>
                  <CheckCircle2 size={16} /> Završene
                </>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-blue-300 text-center">Učitavanje porudžbina...</p>
        ) : filtered.length === 0 ? (
          <p className="text-blue-300 text-center">
            Nema porudžbina u ovoj kategoriji.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-[#0f1e33] rounded-xl border border-[#243b55] p-6 shadow-md hover:border-sky-500 transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-sky-300">
                    Porudžbina #{order.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center text-blue-200 text-sm mb-2">
                  <Clock size={16} className="mr-2 text-sky-400" />
                  Kreirana: {formatDate(order.createdOn)}
                </div>

                {order.reviewedOn && (
                  <div className="flex items-center text-blue-200 text-sm mb-2">
                    <CheckCircle2 size={16} className="mr-2 text-green-400" />
                    Pregledana: {formatDate(order.reviewedOn)}
                  </div>
                )}

                {order.reviewedBy && (
                  <p className="text-sm text-blue-200">
                    👤 Pregledao:{" "}
                    <span className="text-blue-50 font-medium">
                      {order.reviewedBy}
                    </span>
                  </p>
                )}

                <div className="mt-4 border-t border-[#334155] pt-3 flex justify-between text-sm text-blue-100">
                  <span>Status:</span>
                  <span className="font-medium text-sky-300">
                    {order.status}
                  </span>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleShowDetails(order.id)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 px-5 py-2 rounded-lg text-sm font-semibold text-white transition shadow-sm"
                  >
                    <ShoppingCart size={16} /> Detalji
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && selectedOrder.items && (
        <OrderDetailsModal
          orderId={selectedOrder.id}
          createdOn={selectedOrder.createdOn}
          status={selectedOrder.status}
          items={selectedOrder.items}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Summary bar */}
      <div className="mt-10 bg-[#0f1e33] border border-[#243b55] rounded-xl p-5 flex flex-col md:flex-row justify-between items-center shadow-md">
        <p className="text-sky-300 font-semibold text-lg mb-2 md:mb-0">
          Pregled narudžbina
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <span className="bg-[#1b263b] text-blue-200 px-4 py-1.5 rounded-full border border-[#2c3e55] shadow-sm">
            Ukupno:{" "}
            <span className="text-sky-400 font-semibold">{orders.length}</span>
          </span>

          <span className="bg-[#1b263b] text-green-300 px-4 py-1.5 rounded-full border border-green-800/40 shadow-sm">
            Aktivne:{" "}
            <span className="text-green-400 font-semibold">
              {orders.filter((o) => o.status === "ACTIVE").length}
            </span>
          </span>

          <span className="bg-[#1b263b] text-yellow-200 px-4 py-1.5 rounded-full border border-yellow-700/40 shadow-sm">
            Poslate:{" "}
            <span className="text-yellow-300 font-semibold">
              {orders.filter((o) => o.status === "SUBMITTED").length}
            </span>
          </span>

          <span className="bg-[#1b263b] text-blue-200 px-4 py-1.5 rounded-full border border-blue-800/40 shadow-sm">
            Završene:{" "}
            <span className="text-blue-400 font-semibold">
              {
                orders.filter(
                  (o) =>
                    o.status === "APPROVED" ||
                    o.status === "REVIEWED" ||
                    o.status === "COMPLETED"
                ).length
              }
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
