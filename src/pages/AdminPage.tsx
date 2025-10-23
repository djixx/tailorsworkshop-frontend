import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, PlusCircle } from "lucide-react";
import ProductTable from "./ProductTable";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsAdmin(userRole === "ADMIN");
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1e1e2f] text-gray-300">
        <ShieldCheck className="text-red-400 mb-4" size={48} />
        <h2 className="text-2xl font-semibold">Pristup zabranjen</h2>
        <p className="text-gray-400 mt-2">
          Ova stranica je dostupna samo administratorima.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#1e1e2f] text-gray-200 flex flex-col items-center py-12 px-6">
      <button
        onClick={() => navigate("/add-product")}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all shadow-lg"
      >
        <PlusCircle size={20} />
        Dodaj novi proizvod
      </button>
      <ProductTable />
    </div>
  );
};

export default AdminPage;
