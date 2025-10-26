import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { categoryImages } from "../constants";
import { Grid3x3 } from "lucide-react";

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
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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
    <div className="min-h-screen bg-[#0d1b2a] text-blue-100 py-12 px-6">
      {/* HEADER */}
      <div className="flex justify-center items-center gap-3 mb-12">
        <Grid3x3 size={36} className="text-sky-400" />
        <h1 className="text-4xl font-bold text-sky-400 tracking-wide">
          KATEGORIJE PROIZVODA
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-blue-200">Učitavanje kategorija...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : categories.length === 0 ? (
        <div className="bg-[#1b263b] border border-[#243b55] rounded-xl p-8 text-center text-blue-200 shadow-md max-w-2xl mx-auto">
          <p className="text-lg">Nema dostupnih kategorija.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {categories.map((cat) => {
            const imgSrc =
              categoryImages[cat.name.toLowerCase()] || "/fallback.jpg";

            return (
              <Link
                key={cat.id}
                to={`/products/${cat.id}`}
                className="group relative rounded-3xl overflow-hidden bg-[#1b263b] border border-[#243b55] shadow-lg hover:shadow-sky-700/20 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative w-full h-140 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/80 via-[#0d1b2a]/30 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-6 py-5 text-center bg-gradient-to-t from-[#0d1b2a]/60 to-transparent">
                  <h2 className="text-2xl font-semibold text-blue-100 tracking-wide group-hover:text-sky-400 transition-colors duration-300">
                    {formatName(cat.name)}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
