import { CircleUserRound, Search, ShoppingBag } from "lucide-react";
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
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      return;
    }
    navigate("/products");
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-cream)] bg-[var(--parchment)]/95 backdrop-blur">
      <div className="container-shell py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link className="flex items-center gap-2 text-[24px] font-medium text-[var(--near-black)]" to="/">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--terracotta)] text-[var(--ivory)]">
              <ShoppingBag size={16} />
            </span>
            <span className="font-['Georgia']">ElectroMart</span>
          </Link>

          <div className="mx-auto hidden max-w-[480px] flex-1 md:block">
            <form className="surface-card flex items-center gap-2 rounded-[32px] border border-[var(--border-warm)] bg-[var(--ivory)] px-3 py-2 shadow-none" onSubmit={onSearch}>
              <Search size={16} className="text-[var(--stone-gray)]" />
              <input
                aria-label="Search products"
                className="w-full border-none bg-transparent text-[14px] text-[var(--near-black)] outline-none placeholder:text-[var(--stone-gray)]"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary rounded-full px-3 py-2 text-[12px]" type="submit">
                Search
              </button>
            </form>
          </div>

          <nav className="ml-auto flex items-center gap-2">
            <Link className="btn btn-sand" to="/products">
              Shop
            </Link>
            {userId && (
              <>
                <Link className="btn btn-sand hidden lg:inline-flex" to="/add-product">
                  Add Product
                </Link>
                <Link className="btn btn-sand hidden lg:inline-flex" to="/my-orders">
                  My Orders
                </Link>
                <Link className="btn btn-sand hidden lg:inline-flex" to="/seller-orders">
                  Seller
                </Link>
              </>
            )}
             {userId ? (
               <div className="relative" ref={menuRef}>
                  <button
                    aria-label="Profile menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[var(--border-warm)] bg-[var(--ivory)] text-[var(--near-black)] transition hover:shadow-[var(--ivory)_0px_0px_0px_0px,var(--ring-deep)_0px_0px_0px_1px]"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    type="button"
                  >
                    <CircleUserRound size={18} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-12 z-50 w-[170px] rounded-[12px] border border-[var(--border-warm)] bg-[var(--ivory)] p-2 shadow-[var(--shadow-whisper)]">
                      <Link className="block rounded-[8px] px-3 py-2 text-[14px] text-[var(--near-black)] hover:bg-[var(--warm-sand)]" to="/profile" onClick={() => setMenuOpen(false)}>
                        Profile
                      </Link>
                      <button className="mt-1 w-full rounded-[8px] px-3 py-2 text-left text-[14px] text-[var(--near-black)] hover:bg-[var(--warm-sand)]" onClick={logout} type="button">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link className="btn btn-sand" to="/signup">
                    Signup
                 </Link>
                 <Link className="btn btn-primary" to="/login">
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>

      </div>
    </header>
  );
}
