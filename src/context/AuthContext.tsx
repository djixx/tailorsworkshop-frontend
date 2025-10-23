import { createContext, useState, useEffect,type ReactNode } from "react";

type UserRole = "USER" | "ADMIN" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role") as UserRole;
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  const login = (token: string, userRole: UserRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole || "USER");
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
