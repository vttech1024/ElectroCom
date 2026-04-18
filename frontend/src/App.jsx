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
    <div className="min-h-screen bg-[var(--parchment)] text-[var(--near-black)]">
      <NavBar />
      <main className="container-shell pb-20 pt-10">
        <Routes>
          <Route path="/" element={<DiscoverProductsPage />} />
          <Route path="/products" element={<DiscoverProductsPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route
            path="/checkout/:productId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-orders"
            element={
              <ProtectedRoute>
                <SellerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <footer className="mt-8 border-t border-[var(--dark-surface)] bg-[var(--near-black)] text-[var(--warm-silver)]">
        <div className="container-shell grid gap-8 py-12 md:grid-cols-4">
          <div>
            <p className="mb-4 text-[16px] font-medium text-[var(--ivory)]">Support</p>
            <div className="space-y-3">
              <p className="text-[14px] text-[var(--warm-silver)]">Help Center</p>
              <p className="text-[14px] text-[var(--warm-silver)]">Cancellation options</p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[16px] font-medium text-[var(--ivory)]">Buying</p>
            <div className="space-y-3">
              <p className="text-[14px] text-[var(--warm-silver)]">How to shop</p>
              <p className="text-[14px] text-[var(--warm-silver)]">COD policy</p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[16px] font-medium text-[var(--ivory)]">Selling</p>
            <div className="space-y-3">
              <p className="text-[14px] text-[var(--warm-silver)]">List your products</p>
              <p className="text-[14px] text-[var(--warm-silver)]">Seller dashboard</p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[16px] font-medium text-[var(--ivory)]">Company</p>
            <div className="space-y-3">
              <p className="text-[14px] text-[var(--warm-silver)]">About ElectroMart</p>
              <p className="text-[14px] text-[var(--warm-silver)]">Careers</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
