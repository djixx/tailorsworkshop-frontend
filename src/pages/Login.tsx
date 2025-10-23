import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, XCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/authenticate", {
        email,
        password,
      });

      // Pozovi login iz AuthContext-a da sačuva token i rolu
      login(res.data.token, res.data.role);

      setStatus("success");
      setMessage("Uspešno ste se prijavili.");
      navigate("/"); // odmah vodi korisnika na početnu
    } catch (err: any) {
      setStatus("error");
      setMessage("Pogrešan email ili lozinka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f111a] text-white px-4">
      <div className="bg-[#1c1f2b] border border-blue-800/40 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">
          Prijava na nalog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-md bg-[#2a2f44] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Lozinka</label>
            <input
              type="password"
              className="w-full p-3 rounded-md bg-[#2a2f44] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-lg font-semibold flex justify-center items-center gap-2 transition ${
              loading
                ? "bg-blue-900 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Prijava...</span>
              </>
            ) : (
              "Prijavi se"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 flex items-center justify-center gap-2 text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status === "success" ? <Check size={18} /> : <XCircle size={18} />}
            <span>{message}</span>
          </div>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Nemaš nalog?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Registruj se
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
