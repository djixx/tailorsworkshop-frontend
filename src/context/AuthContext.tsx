import { createContext, useState, useEffect, type ReactNode } from "react";

type UserRole = "USER" | "ADMIN" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  email: string | null; 
  login: (token: string, role: UserRole, email: string) => void; 
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  email: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState<string | null>(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role") as UserRole;
    const storedEmail = localStorage.getItem("email");
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
      setEmail(storedEmail);
    }
  }, []);

  const login = (token: string, userRole: UserRole, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole || "USER");
    localStorage.setItem("email", email);
    setIsAuthenticated(true);
    setRole(userRole);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
