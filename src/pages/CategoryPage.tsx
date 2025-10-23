import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Proizvodi za kategoriju #{categoryId}
      </h1>
      {loading ? (
        <p>Učitavanje...</p>
      ) : products.length === 0 ? (
        <p>Nema proizvoda za ovu kategoriju.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center z-[999]">
          <div className="bg-[#1e1e2f] text-gray-100 rounded-lg p-6 w-full max-w-xl relative shadow-xl border border-gray-700">
            <button
              onClick={() => setSelectedProductId(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
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
