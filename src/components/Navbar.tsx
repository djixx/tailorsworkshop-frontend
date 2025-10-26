import logo1 from "../assets/logo2nobg.png";
import { LogOut, ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "Početna", href: "/" },
    ...(isAuthenticated && role === "USER"
      ? [
          { label: "Proizvodi", href: "/products" },
          { label: "Dashboard", href: "/userDashboard" },
        ]
      : []),
    ...(isAuthenticated && role === "ADMIN"
      ? [
          { label: "Dashboard", href: "/adminDashboard" },
          { label: "Proizvodi", href: "/admin" },
          { label: "Transakcije", href: "/adminTransactionsPage" },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 bg-[#0f172a]/70">
      <div className="container px-4 mx-auto relative lg:text-sm flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img className="h-10 w-10 mr-2" src={logo1} alt="Logo" />
          <span className="text-xl font-semibold text-gray-100 tracking-tight">
            Tailors Workshop
          </span>
        </div>

        {/* Navigacija */}
        <ul className="hidden lg:flex ml-14 space-x-10">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desna strana */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Ikonica korpe */}
          {isAuthenticated && role === "USER" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 text-gray-300 hover:text-blue-400 transition"
              title="Korpa"
            >
              <ShoppingCart size={20} />
            </button>
          )}

          {/* Dugmad login/logout */}
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="py-2 px-4 border border-gray-600 rounded-md hover:bg-gray-800 hover:text-white transition"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-blue-600 to-blue-800 py-2 px-4 rounded-md text-white hover:from-blue-700 hover:to-blue-900 transition"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 px-3 border border-gray-600 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition"
            >
              <LogOut size={18} /> Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
