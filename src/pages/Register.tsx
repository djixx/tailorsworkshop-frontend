import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, XCircle, UserPlus } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
      const res = await axios.post("http://localhost:8080/auth/register", {
        firstname,
        lastname,
        email,
        password,
      });

      login(res.data.token, res.data.role, res.data.email);

      setStatus("success");
      setMessage("Registracija uspešna! Dobrodošli.");
      navigate("/");
    } catch (err: any) {
      setStatus("error");
      setMessage("Došlo je do greške pri registraciji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1f] via-[#0d1b2a] to-[#16213e] text-white px-4">
      <div className="bg-[#1b2436]/90 backdrop-blur-lg border border-[#243b55] p-10 rounded-3xl shadow-[0_0_40px_-10px_rgba(56,189,248,0.2)] w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <UserPlus size={28} className="text-sky-400" />
          <h2 className="text-3xl font-bold text-center text-sky-400 tracking-wide">
            Kreiraj nalog
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Ime</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#232b3e] text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Prezime</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#232b3e] text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-[#232b3e] text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Lozinka</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-[#232b3e] text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all ${
              loading
                ? "bg-sky-900 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Registracija...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Registruj se</span>
              </>
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 flex items-center justify-center gap-2 text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status === "success" ? <Check size={18} /> : <XCircle size={18} />}
            <span>{message}</span>
          </div>
        )}

        <p className="mt-8 text-center text-gray-400 text-sm">
          Već imaš nalog?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer transition"
          >
            Prijavi se
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
