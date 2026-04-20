// ─── App.jsx ──────────────────────────────────────────────────────────────────
import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DiscoverProductsPage from "./pages/DiscoverProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AddProductPage from "./pages/AddProductPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import { NavBar } from "./components/NavBar";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="volt-app-shell">
      <NavBar />
      <main className="volt-main">
        <Routes>
          <Route path="/" element={<DiscoverProductsPage />} />
          <Route path="/products" element={<DiscoverProductsPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/checkout/:productId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
          <Route path="/seller-orders" element={<ProtectedRoute><SellerOrdersPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>

      <footer className="volt-footer">
        <div className="volt-footer-inner">
          <div className="volt-footer-brand">
            <span className="volt-brand-mark">⚡</span>
            <span className="volt-brand-name">VOLT</span>
            <p className="volt-footer-tagline">Next-gen electronics. Cash on delivery.</p>
          </div>

          <div className="volt-footer-col">
            <p className="volt-footer-heading">Support</p>
            <span className="volt-footer-link">Help Center</span>
            <span className="volt-footer-link">Cancellation Policy</span>
            <span className="volt-footer-link">Returns</span>
          </div>
          <div className="volt-footer-col">
            <p className="volt-footer-heading">Buying</p>
            <span className="volt-footer-link">How to Shop</span>
            <span className="volt-footer-link">COD Policy</span>
            <span className="volt-footer-link">Track Order</span>
          </div>
          <div className="volt-footer-col">
            <p className="volt-footer-heading">Selling</p>
            <span className="volt-footer-link">List Products</span>
            <span className="volt-footer-link">Seller Dashboard</span>
            <span className="volt-footer-link">Seller FAQ</span>
          </div>
          <div className="volt-footer-col">
            <p className="volt-footer-heading">Company</p>
            <span className="volt-footer-link">About Volt</span>
            <span className="volt-footer-link">Careers</span>
            <span className="volt-footer-link">Press</span>
          </div>
        </div>

        <div className="volt-footer-bottom">
          <span className="font-mono text-[11px] text-[var(--volt-muted)]">© 2025 VOLT ELECTRONICS — ALL RIGHTS RESERVED</span>
          <span className="font-mono text-[11px] text-[var(--volt-muted)]">MADE IN INDIA 🇮🇳</span>
        </div>
      </footer>
    </div>
  );
}