import React from "react";
import { X } from "lucide-react";

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

const formatOptions = (optionsJson: string) => {
  try {
    return optionsJson
      .replace(/^{|}$/g, "")
      .split(",")
      .map((pair) => {
        const [key, value] = pair.split("=");
        return `${key.trim()}: ${value.trim()}`;
      });
  } catch {
    return [optionsJson];
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
      <div className="bg-[#1e1e2f] text-gray-100 rounded-xl w-full max-w-2xl p-6 relative shadow-2xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
          Detalji porudžbine #{orderId}
        </h2>

        <p className="text-sm text-gray-400 mb-4 text-center">
          📅 {new Date(createdOn).toLocaleString("sr-RS")} — Status:{" "}
          <span className="text-blue-300 font-medium">{status}</span>
        </p>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-700 rounded-lg p-4 bg-[#2a2a3d]"
            >
              <h3 className="text-lg font-semibold text-blue-300">
                {item.productName}
              </h3>
              <ul className="text-gray-400 text-sm">
                {formatOptions(item.optionsJson).map((opt, j) => (
                  <li key={j}>• {opt}</li>
                ))}
              </ul>
              <div className="mt-2 text-sm text-gray-300 flex justify-between">
                <span>Količina: {item.quantity}</span>
                <span>{item.totalPrice.toFixed(2)} RSD</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-gray-700 pt-4 text-center">
          <p className="text-lg font-semibold text-blue-300">
            Ukupno: {subtotal.toFixed(2)} RSD
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
