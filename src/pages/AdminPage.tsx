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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0b1320] to-[#1b263b] text-gray-300">
        <ShieldCheck className="text-red-400 mb-4" size={56} />
        <h2 className="text-3xl font-bold text-red-400">Pristup zabranjen</h2>
        <p className="text-gray-400 mt-2 text-center">
          Ova stranica je dostupna samo administratorima.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1320] to-[#1b263b] text-gray-200 py-10 px-4 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-5xl text-center md:text-left mb-8 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck size={36} className="text-sky-400" />
            <h1 className="text-3xl font-bold text-sky-400 tracking-wide">
              ADMIN PANEL
            </h1>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white px-5 py-2.5 rounded-lg text-base font-medium transition-all shadow-md hover:shadow-sky-900/40"
          >
            <PlusCircle size={20} />
            Dodaj novi proizvod
          </button>
        </div>
        <p className="text-gray-400 text-sm md:text-base mt-1 md:mt-2">
          Upravljajte proizvodima i katalogom iz centralne tačke.
        </p>
      </div>
<div className="w-full max-w-6xl bg-[#1b2436]/90 border border-[#243b55] backdrop-blur-md rounded-xl shadow-md p-1">
  <div className="bg-[#1f273d]/70 rounded-lg p-2 border border-[#243b55]/50 shadow-inner">
    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600 scrollbar-track-[#1b2436] rounded-lg">
      <ProductTable />
    </div>
  </div>
</div>

    </div>
  );
};

export default AdminPage;
