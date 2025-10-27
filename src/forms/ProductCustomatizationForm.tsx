import { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import ToastMessage from "../components/ToastMessage";
import { AuthContext } from "../context/AuthContext"; 
import { Package, X, ShoppingCart } from "lucide-react";

type ProductDetails = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  optionChoiceMap: Record<string, Record<number, string>>;
};

type Props = {
  productId: number;
  onClose: () => void;
};

const formatLabel = (label: string) => {
  switch (label.toUpperCase()) {
    case "COLOR":
      return "Boja";
    case "MATERIAL":
      return "Materijal";
    case "SIZE":
      return "Veličina";
    case "LENGTH":
      return "Dužina";
    case "WAIST_TYPE":
      return "Tip struka";
    case "POCKETS":
      return "Džepovi";
    case "STRAP_TYPE":
      return "Tip kaiša / naramenica";
    case "LINING_MATERIAL":
      return "Postava";
    case "PATTERN":
      return "Dezen / šara";
    default:
      return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }
};

const ProductCustomizationForm = ({ productId, onClose }: Props) => {
  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { email } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setDetails(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju proizvoda:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (optionType: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!details) return;

    const requiredKeys = Object.keys(details.optionChoiceMap);
    const missing = requiredKeys.filter((key) => !selectedOptions[key]);

    if (missing.length > 0) {
      setToastMessage("Molimo vas da izaberete sve opcije pre dodavanja u korpu.");
      setToastVisible(true);
      return;
    }

    const payload = {
      email: email ?? "user@gmail.com",
      selectedChoiceMap: selectedOptions,
    };

    try {
      await api.post(`/cart/add/${productId}`, payload);
      setToastMessage("Proizvod je uspešno dodat u korpu!");
      setToastVisible(true);
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error("Greška pri slanju narudžbine:", error);
      setToastMessage("Došlo je do greške. Pokušajte ponovo.");
      setToastVisible(true);
    }
  };

  if (loading || !details) {
    return <p className="text-gray-300 text-center mt-10">Učitavanje forme...</p>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="relative max-h-[90vh] overflow-y-auto mx-4 w-full max-w-lg bg-[#0f172a] text-gray-100 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.7)] border border-blue-900/40 p-8 transition-all duration-500 animate-fadeIn scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent hover:scrollbar-thumb-blue-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
        >
          <X size={22} />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <Package className="text-blue-500" size={22} />
          <h2 className="text-2xl font-semibold text-blue-400">Prilagodi proizvod</h2>
        </div>
        <h3 className="text-xl font-semibold text-gray-100 mb-1">{details.name}</h3>
        <p className="mb-3 text-gray-400">{details.description}</p>
        <p className="mb-6 text-blue-400 font-bold text-lg">
          Cena: {details.price.toFixed(2)} RSD
        </p>
        <div className="space-y-5">
          {Object.entries(details.optionChoiceMap).map(([optionType, choices]) => (
            <div key={optionType}>
              <label className="block font-medium text-gray-200 mb-2">
                {formatLabel(optionType)}
              </label>

              {optionType === "LENGTH" ? (
                <input
                  type="number"
                  min={20}
                  max={60}
                  placeholder="npr. 35"
                  className="w-full border border-gray-700 rounded-md px-3 py-2 bg-[#1e293b] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={selectedOptions[optionType] || ""}
                  onChange={(e) => handleChange(optionType, e.target.value)}
                />
              ) : (
                <select
                  className="w-full border border-gray-700 rounded-md px-3 py-2 bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={selectedOptions[optionType] || ""}
                  onChange={(e) => handleChange(optionType, e.target.value)}
                >
                  <option value="" className="text-gray-400">
                    Odaberite {formatLabel(optionType).toLowerCase()}
                  </option>
                  {Object.entries(choices).map(([id, name]) => (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} /> 
        </button>
        <ToastMessage
          isVisible={toastVisible}
          message={toastMessage}
          type={toastMessage.includes("greške") ? "error" : "success"}
          onClose={() => setToastVisible(false)}
        />
      </div>
    </div>
  );
};

export default ProductCustomizationForm;
