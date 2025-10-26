import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig"; 

type ProductDetails = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  categoryName: string;
};

const ProductDetailsPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`); 
        setProduct(res.data);
      } catch (err: any) {
        console.error("Greška pri dohvaćanju detalja proizvoda:", err);
        if (err.response?.status === 403) {
          setError("Nemate dozvolu da pristupite ovom proizvodu.");
        } else {
          setError("Došlo je do greške pri učitavanju podataka.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-300">Učitavanje...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!product) return <p className="p-6 text-gray-400">Proizvod nije pronađen.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-[#1e1e2f] text-gray-100 rounded-lg shadow-lg border border-gray-700">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">{product.name}</h1>
      <p className="text-gray-300 mb-4">{product.description}</p>
      <p className="text-green-400 font-bold text-xl mb-2">
        {product.price.toFixed(2)} RSD
      </p>
      <p className="text-sm text-gray-400">
        Kategorija: <span className="text-gray-200">{product.categoryName}</span>
      </p>
    </div>
  );
};

export default ProductDetailsPage;
