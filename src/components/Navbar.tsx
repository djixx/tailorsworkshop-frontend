import logo1 from "../assets/logo1.png";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "Početna", href: "/" },
    ...(isAuthenticated && role === "USER"
      ? [
          { label: "Proizvodi", href: "/products" },
          { label: "Korpa", href: "/cart" },
          { label: "Dashboard", href: "/userDashboard" },
        ]
      : []),
    ...(isAuthenticated && role === "ADMIN"
      ? [{ label: "Dashboard", href: "/adminDashboard" },
        { label: "Proizvodi", href: "/admin" }
      ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm flex justify-between items-center">
        <div className="flex items-center flex-shrink-0">
          <img className="h-10 w-10 mr-2" src={logo1} alt="Logo" />
          <span className="text-xl tracking-tight">Krojačnica</span>
        </div>

        <ul className="hidden lg:flex ml-14 space-x-12">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center space-x-6">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="py-2 px-3 border rounded-md hover:bg-gray-800"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-blue-500 to-blue-800 py-2 px-3 rounded-md text-white"
              >
                Kreirajte nalog
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 px-3 border rounded-md hover:bg-red-600 hover:text-white"
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
