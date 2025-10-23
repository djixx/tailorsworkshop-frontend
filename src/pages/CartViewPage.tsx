import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import api from "../api/axiosConfig";

type CartItem = {
  id?: number;
  productName: string;
  productPrice: number;
  totalPrice: number;
  quantity: number;
  optionsJson: string;
};

type ShoppingCart = {
  id?: number;
  createdBy?: string;
  items: CartItem[];
};

const CartView = () => {
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Učitavanje korpe
  const fetchCart = async () => {
    try {
      const res = await api.get(`/cart`);
      setCart(res.data);
      setError(null);
    } catch (err: any) {
      console.error("Greška pri učitavanju korpe:", err);
      if (err.response?.status === 404) {
        setCart(null);
        setError(null);
      } else {
        setError("Došlo je do greške pri učitavanju korpe.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];

  // 🔹 Lepo formatirane opcije
  const formatOptions = (
    optionsJson: string
  ): { label: string; value: string }[] => {
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
        value: value,
      }));
    } catch {
      return [];
    }
  };

  /** 🔧 PUT /cart/update/{itemId} */
  const handleUpdateItem = async (itemId: number, updateData: any) => {
    try {
      await api.put(`cart/update/${itemId}`, updateData);
      await fetchCart();
    } catch (err) {
      console.error("Greška pri ažuriranju stavke:", err);
      setMessage("Greška pri ažuriranju stavke.");
    }
  };

  /** ✏️ Izmena količine */
  const handleEdit = async (item: CartItem) => {
    if (!item.id) return;

    const novaKolicina = prompt(
      `Unesi novu količinu za "${item.productName}":`,
      item.quantity.toString()
    );
    if (!novaKolicina) return;

    const parsedOptions =
      item.optionsJson && item.optionsJson.trim() !== "{}"
        ? JSON.parse(item.optionsJson)
        : {};

    const requestBody = {
      productId: item.id,
      delete: false,
      selectedChoiceMap: parsedOptions,
      quantity: parseInt(novaKolicina),
    };

    await handleUpdateItem(item.id, requestBody);
    setMessage(`✅ Izmenjena količina za ${item.productName}.`);
  };

  /** 🗑️ Brisanje stavke */
  const handleRemove = async (item: CartItem) => {
    if (!item.id) return;
    const confirmDelete = confirm(
      `Da li želiš da ukloniš "${item.productName}" iz korpe?`
    );
    if (!confirmDelete) return;

    const parsedOptions =
      item.optionsJson && item.optionsJson.trim() !== "{}"
        ? JSON.parse(item.optionsJson)
        : {};

    const requestBody = {
      productId: item.id,
      delete: true,
      selectedChoiceMap: parsedOptions,
      quantity: item.quantity,
    };

    await handleUpdateItem(item.id, requestBody);
    setMessage(`🗑️ ${item.productName} je uklonjen iz korpe.`);
  };

  /** 🧾 Slanje kompletne korpe */
  const handleSubmit = async () => {
    if (!cart) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post(`/cart/submit`, cart);

      setMessage("✅ Korpa uspešno poslata!");
      setCart(null);

      setTimeout(async () => {
        await fetchCart();
        setMessage("🆕 Nova korpa je spremna!");
      }, 800);
    } catch (err) {
      console.error("Greška pri slanju korpe:", err);
      setMessage("Došlo je do greške pri slanju korpe.");
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

  // 🔹 Stati prikazi
  if (loading)
    return (
      <p className="text-gray-300 text-center mt-10">⏳ Učitavanje korpe...</p>
    );

  if (error)
    return <p className="text-red-400 text-center mt-10">{error}</p>;

  if (!cart || items.length === 0)
    return (
      <div className="bg-[#1e1e2f] text-gray-100 p-8 rounded-lg shadow-xl w-full max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">
          Vaša korpa je prazna 🛒
        </h2>
        <p className="text-gray-400">
          Dodajte proizvode kako biste započeli novu porudžbinu.
        </p>
      </div>
    );

  // 🔹 Glavni prikaz
  return (
    <div className="bg-[#1e1e2f] text-gray-100 p-8 rounded-lg shadow-2xl w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
        Vaša korpa
      </h2>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-700 rounded-lg p-6 bg-[#2a2a3d] hover:bg-[#32324a] transition-all duration-300 shadow-md"
          >
            <div className="flex-1 w-full">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">
                {item.productName}
              </h3>

              {/* 🔹 Prikaz opcija u badge stilu */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formatOptions(item.optionsJson).length > 0 ? (
                  formatOptions(item.optionsJson).map((opt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 bg-[#283046] px-3 py-1 rounded-full text-sm border border-gray-600 shadow-sm"
                    >
                      <span className="text-blue-300 font-medium">
                        {opt.label}:
                      </span>
                      <span className="text-gray-100">{opt.value}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">
                    Nema dodatnih opcija
                  </span>
                )}
              </div>

              <p className="text-gray-300">
                Količina:{" "}
                <span className="font-medium">{item.quantity}</span>
              </p>
            </div>

            <div className="mt-6 md:mt-0 text-right w-full md:w-auto">
              <p className="text-gray-400 text-sm">Cena po komadu</p>
              <p className="text-lg font-bold text-green-400">
                {item.productPrice?.toFixed(2)} RSD
              </p>

              <p className="text-gray-400 text-sm mt-2">Ukupno</p>
              <p className="text-lg font-bold text-blue-400 mb-3">
                {item.totalPrice?.toFixed(2)} RSD
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-md bg-white hover:bg-blue-600 hover:text-white text-black transition"
                  title="Izmeni stavku"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  className="p-2 rounded-md bg-red-500 hover:bg-red-700 text-white transition"
                  title="Ukloni stavku"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Ukupno */}
      <div className="mt-10 bg-[#1f2a40] border border-blue-600 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          🧾 Ukupno
        </h3>

        <div className="space-y-3 text-gray-200 text-sm">
          <div className="flex justify-between pt-2 text-lg font-bold text-blue-300">
            <span>Za plaćanje:</span>
            <span>{subtotal.toFixed(2)} RSD</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`mt-6 w-full py-3 rounded-lg font-semibold tracking-wide transition ${
            submitting
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {submitting ? " Slanje narudžbine..." : " Potvrdi narudžbinu"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CartView;
