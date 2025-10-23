import { useEffect, useState } from "react";
import { Clock, CheckCircle2, ShoppingCart, FileClock } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";
import api from "../api/axiosConfig";

type ShoppingCart = {
  id: number;
  createdOn: string;
  cratedBy: UserEntity;
  status: string;
  reviewedOn?: string | null;
  reviewedBy?: string | null;
  items?: CartItem[];
};

type UserEntity ={

}
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
        return "text-green-400 bg-green-900/40";
      case "SUBMITTED":
        return "text-yellow-400 bg-yellow-800/30";
      case "APPROVED":
        return "text-blue-400 bg-blue-900/40";
      case "REJECTED":
        return "text-red-400 bg-red-900/40";
      default:
        return "text-gray-400 bg-gray-700";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("sr-RS", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const handleShowDetails = async (cartId: number) => {
    try {
      const res = await api.get(`/cart/${cartId}`); // koristi api sa tokenom
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju detalja porudžbine:", err);
      alert("Nije moguće učitati detalje porudžbine.");
    }
  };

  return (
    <div className="bg-[#1e1e2f] text-gray-100 p-8 rounded-lg shadow-xl w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
        Moje narudžbine
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        {["ACTIVE", "SUBMITTED", "REVIEWED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-[#2a2a3d] hover:bg-[#32324a] text-gray-300"
            }`}
          >
            {tab === "ACTIVE" && (
              <span className="flex items-center gap-2">
                <FileClock size={16} /> Aktivne
              </span>
            )}
            {tab === "SUBMITTED" && (
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} /> Poslate
              </span>
            )}
            {tab === "REVIEWED" && (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} /> Završene
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Učitavanje porudžbina...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center">
          Nema porudžbina u ovoj kategoriji.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-[#2a2a3d] rounded-xl border border-gray-700 p-6 shadow-md hover:bg-[#32324a] transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-blue-300">
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

              <div className="flex items-center text-gray-400 text-sm mb-2">
                <Clock size={16} className="mr-2 text-blue-400" />
                Kreirana: {formatDate(order.createdOn)}
              </div>

              {order.reviewedOn && (
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <CheckCircle2 size={16} className="mr-2 text-green-400" />
                  Pregledana: {formatDate(order.reviewedOn)}
                </div>
              )}

              {order.reviewedBy && (
                <p className="text-sm text-gray-400">
                  👤 Pregledao:{" "}
                  <span className="text-gray-200">{order.reviewedBy}</span>
                </p>
              )}

              <div className="mt-4 border-t border-gray-600 pt-3 flex justify-between text-sm text-gray-300">
                <span>Status:</span>
                <span className="font-medium">{order.status}</span>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleShowDetails(order.id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <ShoppingCart size={16} /> Detalji
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    
      {selectedOrder && selectedOrder.items && (
        <OrderDetailsModal
          orderId={selectedOrder.id}
          createdOn={selectedOrder.createdOn}
          status={selectedOrder.status}
          items={selectedOrder.items}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderDashboard;
