import { useEffect, useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

type CartItem = {
  id?: number;
  productName: string;
  productPrice: number;
  totalPrice: number;
  quantity: number;
  optionsJson: string;
};

type ShoppingCartType = {
  id?: number;
  createdBy?: string;
  items?: CartItem[]; // ⚠️ sad je optional da ne bi puklo ako backend ne pošalje
};

const CartView = () => {
  const [cart, setCart] = useState<ShoppingCartType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      // ⚠️ fallback na prazan niz ako backend ne pošalje items
      const cartData = res.data ?? {};
      if (!Array.isArray(cartData.items)) {
        cartData.items = [];
      }
      setCart(cartData);
    } catch (err) {
      console.error("Greška pri učitavanju korpe:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateItem = async (itemId: number, data: any) => {
    try {
      await api.put(`/cart/update/${itemId}`, data);
      await fetchCart();
    } catch (err) {
      console.error("Greška pri ažuriranju artikla:", err);
    }
  };

  const handleRemoveItem = async (itemId: number, item: CartItem) => {
    try {
      await api.put(`/cart/update/${itemId}`, {
        productId: item.id,
        delete: true,
        quantity: item.quantity,
        selectedChoiceMap: {},
      });
      await fetchCart();
    } catch (err) {
      console.error("Greška pri uklanjanju artikla:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete("/cart/clear");
      await fetchCart();
    } catch (err) {
      console.error("Greška pri brisanju korpe:", err);
    }
  };

  // 🔹 Mapiranje JSON opcija u čitljive oznake
  const formatOptions = (optionsJson: string) => {
    try {
      const obj = JSON.parse(optionsJson);
      const map: Record<string, string> = {
        COLOR: "Boja",
        LENGTH: "Dužina",
        MATERIAL: "Materijal",
        SIZE: "Veličina",
        PATTERN: "Šara",
        WAIST_TYPE: "Tip struka",
      };
      return Object.entries(obj).map(([key, value]) => ({
        label: map[key.toUpperCase()] || key,
        value: value as string,
      }));
    } catch {
      return [];
    }
  };

  const items = cart?.items ?? []; // ⚠️ fallback da ne puca
  const subtotal = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
  const shipping = subtotal > 0 ? 350 : 0;
  const total = subtotal + shipping;

  if (loading)
    return (
      <p className="text-center text-blue-200 mt-10">Učitavanje korpe...</p>
    );

  if (!items.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#1b263b] text-blue-100 p-10 rounded-2xl shadow-lg max-w-3xl text-center">
          <ShoppingCart className="mx-auto mb-4 text-sky-400" size={48} />
          <h2 className="text-2xl font-bold text-sky-300 mb-2">
            Vaša korpa je prazna
          </h2>
          <p className="text-blue-200">
            Dodajte proizvode kako biste započeli porudžbinu.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-blue-100 py-12 px-6">
      <div className="flex justify-center items-center gap-3 mb-10">
        <ShoppingCart size={40} className="text-sky-400" />
        <h1 className="text-4xl font-bold text-sky-400 tracking-wide">
          SHOPPING CART
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-[#1b263b] rounded-2xl shadow-lg p-6 border border-[#243b55]">
          <h2 className="text-xl font-semibold text-sky-300 mb-6">
            Vaši artikli
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center bg-[#0f1e33] border border-[#243b55] rounded-xl p-5 mb-5 hover:border-sky-500 transition"
            >
              {/* LEFT: DETAILS */}
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-sky-300 truncate">
                  {item.productName}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  Cena: {item.productPrice.toFixed(2)} RSD
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {formatOptions(item.optionsJson).map((opt, i) => (
                    <span
                      key={i}
                      className="bg-[#1e293b] border border-[#334155] text-blue-200 text-xs px-3 py-1 rounded-full shadow-sm"
                    >
                      {opt.label}: {opt.value}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT: PRICE + QTY + DELETE */}
              <div className="flex items-center justify-end gap-6 mt-4 md:mt-0 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdateItem(item.id!, {
                        productId: item.id,
                        delete: false,
                        quantity: Math.max(1, item.quantity - 1),
                        selectedChoiceMap: {},
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-[#1e293b] hover:bg-[#334155] rounded-md text-blue-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-semibold text-blue-50">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateItem(item.id!, {
                        productId: item.id,
                        delete: false,
                        quantity: item.quantity + 1,
                        selectedChoiceMap: {},
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-[#1e293b] hover:bg-[#334155] rounded-md text-blue-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="text-sky-400 font-semibold w-[80px] text-right">
                  {item.totalPrice.toFixed(2)} RSD
                </p>

                <button
                  onClick={() => handleRemoveItem(item.id!, item)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleClearCart}
            className="w-full mt-6 py-3 border border-red-500 text-red-400 font-semibold rounded-xl hover:bg-red-600 hover:text-white transition shadow-md"
          >
            OČISTI KORPU
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#1b263b] rounded-2xl shadow-lg p-6 border border-[#243b55] h-fit">
          <h3 className="text-lg font-semibold text-sky-300 mb-4 text-center">
            Order Summary
          </h3>

          <div className="space-y-3 text-blue-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} RSD</span>
            </div>
            <div className="flex justify-between">
              <span>Dostava:</span>
              <span>{shipping.toFixed(2)} RSD</span>
            </div>
            <div className="border-t border-[#334155] my-3"></div>
            <div className="flex justify-between text-sky-300 font-bold text-lg">
              <span>Ukupno:</span>
              <span>{total.toFixed(2)} RSD</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/stripe")}
            className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 font-semibold rounded-xl text-white shadow-md transition"
          >
            NASTAVI NA PLAĆANJE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
