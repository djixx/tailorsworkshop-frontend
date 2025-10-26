import { useEffect, useState, useMemo, Fragment } from "react";
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import api from "../api/axiosConfig";

type Transaction = {
  id: number;
  buyerEmail: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  cartId?: number;
  cartOwner?: string;
  cartItemList?: {
    productName: string;
    quantity: number;
    totalPrice: number;
  }[];
};

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju transakcija:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [transactions]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const currentData = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return <p className="text-gray-300 text-center mt-10">Učitavanje transakcija...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1320] to-[#1b263b] text-gray-100 py-12 px-6">
      {/* HEADER */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <CreditCard size={32} className="text-sky-400" />
        <h1 className="text-4xl font-bold text-sky-400 tracking-wide">
          TRANSAKCIJE
        </h1>
      </div>

      <div className="max-w-6xl mx-auto border border-[#243b55] rounded-2xl shadow-lg backdrop-blur-md bg-[#1b2436]/80 overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1f2a40] text-gray-200 sticky top-0 z-10 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-3 text-left">Kupac</th>
                <th className="p-3 text-left">Iznos</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((t) => (
                <Fragment key={t.id}>
                  <tr className="border-t border-gray-700 hover:bg-[#243b55]/40 transition">
                    <td className="p-3">{t.buyerEmail || t.cartOwner || "Nepoznato"}</td>
                    <td className="p-3 text-green-400 font-medium">
                      {t.amount} {t.currency}
                    </td>
                    <td
                      className={`p-3 font-medium ${
                        t.status === "succeeded"
                          ? "text-green-400"
                          : t.status === "failed"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </td>
                    <td className="p-3 text-gray-400">
                      {new Date(t.createdAt).toLocaleString("sr-RS")}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleExpanded(t.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-sky-700 hover:bg-sky-800 rounded-md text-white text-sm transition"
                      >
                        {expanded.has(t.id) ? (
                          <>
                            <ChevronUp size={14} /> Sakrij
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} /> Prikaži
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {expanded.has(t.id) && (
                    <tr className="bg-[#162032] border-t border-gray-800">
                      <td colSpan={5} className="p-5">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-300 flex flex-wrap gap-6">
                            <span>Cart ID: {t.cartId ?? "-"}</span>
                            <span>
                              Vlasnik korpe: {t.cartOwner ?? t.buyerEmail ?? "-"}
                            </span>
                          </div>

                          <div className="mt-3">
                            <h3 className="font-semibold text-sky-300 mb-2">
                              Stavke porudžbine
                            </h3>
                            {t.cartItemList && t.cartItemList.length > 0 ? (
                              <table className="w-full text-sm border-t border-gray-700">
                                <thead className="text-gray-400">
                                  <tr>
                                    <th className="py-2 text-left">Proizvod</th>
                                    <th className="py-2 text-left">Količina</th>
                                    <th className="py-2 text-left">Cena</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {t.cartItemList.map((ci, idx) => (
                                    <tr key={idx} className="border-t border-gray-800">
                                      <td className="py-2">{ci.productName}</td>
                                      <td className="py-2">{ci.quantity}</td>
                                      <td className="py-2 text-green-400">
                                        {ci.totalPrice} {t.currency}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-400 text-sm">
                                Nema stavki za prikaz.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === 1
                ? "bg-[#1f2a40] text-gray-500 cursor-not-allowed"
                : "bg-sky-700 hover:bg-sky-800 text-white"
            }`}
          >
            <ArrowLeft size={16} /> Prethodna
          </button>

          <span className="text-gray-300">
            Stranica {currentPage} od {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === totalPages
                ? "bg-[#1f2a40] text-gray-500 cursor-not-allowed"
                : "bg-sky-700 hover:bg-sky-800 text-white"
            }`}
          >
            Sledeća <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
