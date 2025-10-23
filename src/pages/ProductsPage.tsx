import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

type Category = {
  id: number;
  name: string;
};

const ProductsPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get<Category[]>("/categories", {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}, // ako nije ulogovan, pusti bez tokena
        });

        setCategories(res.data);
      } catch (error: any) {
        console.error("Greška pri izlistavanju kategorija:", error);
        setError("Greška pri učitavanju kategorija.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Kategorije proizvoda
      </h1>

      {loading ? (
        <p className="text-gray-400">Učitavanje...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-400">Nema dostupnih kategorija.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products/${cat.id}`}
              className="border border-gray-700 bg-[#1e1e2f] p-6 rounded-lg shadow hover:shadow-lg transition block text-center hover:bg-[#2b2b45]"
            >
              <h2 className="text-xl font-semibold text-blue-300 hover:text-blue-400">
                {formatName(cat.name)}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
