import React from "react";
import { X, CalendarDays } from "lucide-react";

type CartItem = {
  productName: string;
  productPrice: number;
  totalPrice: number;
  quantity: number;
  optionsJson: string;
};

type OrderDetailsModalProps = {
  orderId: number;
  createdOn: string;
  status: string;
  items: CartItem[];
  onClose: () => void;
};

const formatLabel = (key: string) => {
  switch (key.toUpperCase()) {
    case "COLOR":
      return "Boja";
    case "SIZE":
      return "Veličina";
    case "LENGTH":
      return "Dužina";
    case "MATERIAL":
      return "Materijal";
    default:
      return key;
  }
};

const formatOptions = (optionsJson: string) => {
  try {
    const obj = JSON.parse(optionsJson);
    return Object.entries(obj).map(([key, value]) => (
      <span
        key={key}
        className="inline-flex items-center gap-2 bg-[#283046] px-3 py-1 rounded-full text-sm border border-gray-600 shadow-sm"
      >
        <span className="text-blue-300 font-medium">{formatLabel(key)}:</span>
        <span className="text-gray-100">{String(value)}</span>
      </span>
    ));
  } catch {
    return <span className="text-gray-500 italic">Nema opcija</span>;
  }
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  createdOn,
  status,
  items,
  onClose,
}) => {
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2f] text-gray-100 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
          Detalji porudžbine #{orderId}
        </h2>

        <p className="text-sm text-gray-400 mb-4 text-center flex items-center justify-center gap-2">
          <CalendarDays size={16} className="text-blue-400" />
          {new Date(createdOn).toLocaleString("sr-RS")} —{" "}
          <span className="text-blue-300 font-semibold">{status}</span>
        </p>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-700 rounded-lg p-5 bg-[#2a2a3d] hover:bg-[#32324a] transition"
            >
              <h3 className="text-lg font-semibold text-blue-300 mb-3">
                {item.productName}
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {formatOptions(item.optionsJson)}
              </div>

              <div className="flex justify-between text-sm text-gray-300">
                <span>Količina: {item.quantity}</span>
                <span className="font-semibold text-blue-300">
                  {item.totalPrice.toFixed(2)} RSD
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-700 pt-4 text-right">
          <p className="text-lg font-bold text-blue-400">
            Ukupno: {subtotal.toFixed(2)} RSD
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
