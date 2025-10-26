import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import api from "../api/axiosConfig";
import EditProductForm from "../forms/EditProductForm";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  categoryName: string;
};

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (id: number) => {
    setActiveProductId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setActiveProductId(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Da li sigurno želiš da obrišeš proizvod "${name}"?`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Proizvod uspešno obrisan!");
    } catch (err) {
      console.error("Greška pri brisanju proizvoda:", err);
      alert("Došlo je do greške pri brisanju proizvoda.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/all");
        setProducts(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju proizvoda:", err);
        setError("Nije moguće učitati proizvode.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSort = (field: keyof Product) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const filteredProducts = sortedProducts.filter((p) =>
    [p.name, p.description, p.categoryName]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  if (loading)
    return <p className="text-gray-400 text-center mt-20">Učitavanje...</p>;
  if (error) return <p className="text-red-400 text-center mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-[#1e1e2f] flex justify-center pt-10 pb-40">
      <div className="bg-[#24243a] text-gray-100 p-10 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto border border-gray-700">
        <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center tracking-wide">
          Lista proizvoda
        </h2>

        <div className="flex items-center justify-start mb-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Pretraži po nazivu, opisu ili kategoriji..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-lg bg-[#2a2a3d] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-80"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-[#2a2a3d] text-left text-gray-300 text-sm uppercase tracking-wider">
                <th
                  className="p-4 border-b border-gray-700 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Naziv {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 border-b border-gray-700 cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Cena {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4 border-b border-gray-700">Opis</th>
                <th
                  className="p-4 border-b border-gray-700 cursor-pointer"
                  onClick={() => handleSort("categoryName")}
                >
                  Kategorija{" "}
                  {sortField === "categoryName" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4 border-b border-gray-700 text-center">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Nema proizvoda koji odgovaraju pretrazi.
                  </td>
                </tr>
              ) : (
                currentItems.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#30304a] transition border-b border-gray-800 text-sm"
                  >
                    <td className="p-4 font-medium text-gray-100">{product.name}</td>
                    <td className="p-4 text-gray-300">{product.price.toFixed(2)} RSD</td>
                    <td className="p-4 text-gray-400">{product.description}</td>
                    <td className="p-4 text-gray-200">{product.categoryName}</td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => openModal(product.id)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-500 font-medium transition"
                      >
                        <Pencil size={16} /> Uredi
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-500 font-medium transition"
                      >
                        <Trash2 size={16} /> Obriši
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-blue-400 hover:text-blue-500"
            }`}
          >
            <ChevronLeft size={18} /> Prethodna
          </button>

          <span className="text-gray-300 text-sm">
            Stranica {currentPage} od {totalPages || 1}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-blue-400 hover:text-blue-500"
            }`}
          >
            Sledeća <ChevronRight size={18} />
          </button>
        </div>

        {/* Edit Modal */}
        {isModalOpen && activeProductId && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a2238] p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative border border-blue-900/40">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <EditProductForm
                productId={activeProductId}
                onClose={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
