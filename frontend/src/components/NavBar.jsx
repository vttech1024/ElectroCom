// ─── NavBar.jsx ───────────────────────────────────────────────────────────────
import { CircleUserRound, Package, Plus, Search, ShoppingBag, Store, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate("/login");
  };

  const onSearch = (event) => {
    event.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="volt-navbar">
      {/* Top bar */}
      <div className="volt-navbar-top">
        <div className="volt-navbar-inner">

          {/* Brand */}
          <Link className="volt-nav-brand" to="/">
            <span className="volt-nav-brand-icon"><Zap size={14} /></span>
            <span>VOLT</span>
          </Link>

          {/* Search */}
          <form className="volt-search-form" onSubmit={onSearch}>
            <Search size={14} className="volt-search-icon" />
            <input
              aria-label="Search products"
              className="volt-search-input"
              placeholder="Search electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="volt-search-btn" type="submit">SEARCH</button>
          </form>

          {/* Right actions */}
          <nav className="volt-nav-actions">
            {userId ? (
              <>
                <Link className="volt-nav-link hidden lg:flex" to="/add-product">
                  <Plus size={13} /> LIST PRODUCT
                </Link>
                <Link className="volt-nav-link hidden lg:flex" to="/my-orders">
                  <Package size={13} /> MY ORDERS
                </Link>
                <Link className="volt-nav-link hidden lg:flex" to="/seller-orders">
                  <Store size={13} /> SELLER
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    aria-label="Profile menu"
                    className="volt-nav-avatar-btn"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    type="button"
                  >
                    <CircleUserRound size={16} />
                  </button>
                  {menuOpen && (
                    <div className="volt-dropdown">
                      <Link
                        className="volt-dropdown-item"
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                      >
                        PROFILE
                      </Link>
                      <Link
                        className="volt-dropdown-item lg:hidden"
                        to="/add-product"
                        onClick={() => setMenuOpen(false)}
                      >
                        LIST PRODUCT
                      </Link>
                      <Link
                        className="volt-dropdown-item lg:hidden"
                        to="/my-orders"
                        onClick={() => setMenuOpen(false)}
                      >
                        MY ORDERS
                      </Link>
                      <Link
                        className="volt-dropdown-item lg:hidden"
                        to="/seller-orders"
                        onClick={() => setMenuOpen(false)}
                      >
                        SELLER ORDERS
                      </Link>
                      <div className="volt-dropdown-divider" />
                      <button className="volt-dropdown-item volt-dropdown-danger" onClick={logout} type="button">
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link className="volt-nav-link" to="/signup">SIGNUP</Link>
                <Link className="volt-btn-primary volt-nav-login" to="/login">LOGIN</Link>
              </>
            )}
          </nav>

        </div>
      </div>

      {/* Sub nav strip */}
      <div className="volt-subnav">
        <div className="volt-navbar-inner">
          <div className="volt-subnav-links">
            <Link className="volt-subnav-link" to="/products">All Products</Link>
            <Link className="volt-subnav-link" to="/products?q=laptop">Laptops</Link>
            <Link className="volt-subnav-link" to="/products?q=phone">Phones</Link>
            <Link className="volt-subnav-link" to="/products?q=audio">Audio</Link>
            <Link className="volt-subnav-link" to="/products?q=camera">Cameras</Link>
            <Link className="volt-subnav-link" to="/products?q=tablet">Tablets</Link>
            <Link className="volt-subnav-link" to="/products?q=accessories">Accessories</Link>
          </div>
          <div className="volt-subnav-badge">
            <span className="volt-dot" style={{ color: "var(--volt-success)" }} />
            <span className="font-mono text-[10px] text-[var(--volt-muted)]">FREE SHIPPING · COD AVAILABLE</span>
          </div>
        </div>
      </div>
    </header>
  );
}