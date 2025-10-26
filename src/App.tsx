import Workflow from "./components/Workflow";
import "./App.css";
import FeatureSection from "./components/FeatureSection";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import bg1 from "../src/assets/bg2.jpg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import CartViewPage from "./pages/CartViewPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import AdminPage from "./pages/AdminPage";
import AddProductForm from "./forms/AddProductForm";
import ProductTable from "./pages/ProductTable";
import StripePage from "./pages/StripePage";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminTransactionsPage from "./pages/AdminTransactionPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <div
                className="h-screen w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${bg1})` }}
              >
                <div className="max-w-7xl mx-auto pt-20 px-6">
                  <HeroSection />
                </div>
                <FeatureSection />
                <Workflow />
                <Footer />
              </div>
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartViewPage />} />
          <Route path="/userDashboard" element={<UserDashboardPage />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="/productTable" element={<ProductTable />} />
          <Route path="/stripe" element={<StripePage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/adminTransactionsPage" element={<AdminTransactionsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
