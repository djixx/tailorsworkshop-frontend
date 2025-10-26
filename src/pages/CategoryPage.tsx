import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { Tag } from "lucide-react";

import ProductCard from "../components/ProductCard";
import ProductCustomizationForm from "../forms/ProductCustomatizationForm";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  categoryName: string;
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/category/${categoryId}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Greška:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchProducts();
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-blue-100 py-12 px-6">
      {/* HEADER */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <Tag size={34} className="text-sky-400" />
        <h1 className="text-3xl font-bold text-sky-400 tracking-wide">
          {products[0]?.categoryName || `Kategorija #${categoryId}`}
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-blue-200">Učitavanje proizvoda...</p>
      ) : products.length === 0 ? (
        <div className="bg-[#1b263b] border border-[#243b55] rounded-xl p-8 text-center text-blue-200 shadow-md max-w-2xl mx-auto">
          <p className="text-lg">Nema proizvoda za ovu kategoriju.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCustomize={() => setSelectedProductId(product.id)}
            />
          ))}
        </div>
      )}


      {selectedProductId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn">
          <div className="bg-[#1b263b] text-blue-100 rounded-2xl p-8 w-full max-w-lg relative shadow-2xl border border-[#334155]">
            <button
              onClick={() => setSelectedProductId(null)}
              className="absolute top-3 right-3 text-blue-300 hover:text-white transition"
            >
              ✕
            </button>
            <ProductCustomizationForm
              productId={selectedProductId}
              onClose={() => setSelectedProductId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
