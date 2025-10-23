import { useEffect, useState } from "react";
import api from "../api/axiosConfig"; // koristi konfigurisan axios sa tokenom

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
    case "LENGTH":
      return "Dužina";
    case "MATERIAL":
      return "Materijal";
    case "SIZE":
      return "Veličina";
    default:
      return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }
};

const ProductCustomizationForm = ({ productId, onClose }: Props) => {
  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`); // automatski šalje Bearer token
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
      alert("Molimo vas da izaberete sve opcije pre slanja narudžbine.");
      return;
    }

    const payload = {
      email: "djixx@gmail.com", // možeš kasnije da uzmeš iz konteksta korisnika
      selectedChoiceMap: selectedOptions,
    };

    try {
      const res = await api.post(`/cart/add/${productId}`, payload);
      console.log("Dodato u korpu:", res.data);
      alert("Proizvod je uspešno dodat u korpu!");
      onClose();
    } catch (error) {
      console.error("Greška pri slanju narudžbine:", error);
      alert("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  if (loading || !details) {
    return <p className="text-gray-300">Učitavanje forme...</p>;
  }

  return (
    <div className="bg-[#1e1e2f] text-gray-100 p-6 rounded-lg shadow-xl w-full">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">
        Prilagodi: {details.name}
      </h2>

      <p className="mb-2 text-gray-300">{details.description}</p>
      <p className="mb-6 text-blue-300 font-semibold">
        Cena: {details.price.toFixed(2)} RSD
      </p>

      <div className="space-y-4">
        {Object.entries(details.optionChoiceMap).map(([optionType, choices]) => (
          <div key={optionType}>
            <label className="block font-medium text-gray-200 mb-1">
              {formatLabel(optionType)}
            </label>

            {optionType === "LENGTH" ? (
              <input
                type="number"
                min={20}
                max={60}
                placeholder="npr. 35"
                className="w-full border border-gray-700 rounded px-3 py-2 bg-[#2a2a3d] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedOptions[optionType] || ""}
                onChange={(e) => handleChange(optionType, e.target.value)}
              />
            ) : (
              <select
                className="w-full border border-gray-700 rounded px-3 py-2 bg-[#2a2a3d] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedOptions[optionType] || ""}
                onChange={(e) => handleChange(optionType, e.target.value)}
              >
                <option value="" className="text-gray-400">
                  Odaberite {formatLabel(optionType).toLowerCase()}
                </option>
                {Object.entries(choices).map(([id, name]) => (
                  <option key={id} value={name} className="text-gray-100 bg-[#2a2a3d]">
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
        className="mt-8 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Pošaljite narudžbinu
      </button>
    </div>
  );
};

export default ProductCustomizationForm;
