import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiPackage,
  FiLogOut,
  FiShoppingCart,
  FiSearch
} from 'react-icons/fi';
import { HiMenuAlt3 } from 'react-icons/hi';

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px 12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  color: "#374151",
  fontWeight: "500",
  transition: "background 0.15s",
  background: "transparent",
  width: "100%",
  border: "none",
  textAlign: "left",
};

const avatarStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #10b981, #059669)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "700",
  fontSize: "15px",
  flexShrink: 0,
  cursor: "pointer",
  userSelect: "none",
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        setProfileOpen(false);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, []);

  const ProfileDropdown = () => (
    <ul
      style={{
        position: "absolute",
        top: "48px",
        right: 0,
        background: "#fff",
        border: "1px solid #10b98140",
        borderRadius: "16px",
        padding: "6px",
        width: "200px",
        zIndex: 999,
        animation: "dropIn 0.15s ease-out",
        listStyle: "none",
        margin: 0,
      }}
    >
      {/* Header */}
      <li style={{ padding: "10px 12px 10px", borderBottom: "1px solid #f3f4f6", marginBottom: "4px" }}>
        <p style={{ fontWeight: "700", fontSize: "14px", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
          {user.name}
        </p>
        <p style={{ fontSize: "11px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
          {user.email}
        </p>
      </li>

      <li>
        <button
          style={menuItemStyle}
          onClick={() => { setProfileOpen(false); navigate("/profile"); }}
          onMouseEnter={e => e.currentTarget.style.background = "#ecfdf5"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <FiUser className="text-gray-400" /> My Profile
        </button>
      </li>

      <li>
        <button
          style={menuItemStyle}
          onClick={() => { setProfileOpen(false); navigate("/my-orders"); }}
          onMouseEnter={e => e.currentTarget.style.background = "#ecfdf5"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <FiPackage className="text-gray-400" /> My Orders
        </button>
      </li>

      <li style={{ borderTop: "1px solid #f3f4f6", marginTop: "4px", paddingTop: "4px" }}>
        <button
          style={{ ...menuItemStyle, color: "#ef4444" }}
          onClick={logout}
          onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <FiLogOut /> Logout
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <Link to="/">
          <h2 className="text-2xl font-bold text-primary">FreshoMart</h2>
        </Link>

        {/* ── Desktop Menu ── */}
        <div className="hidden sm:flex items-center gap-8">
          <Link to={"/"} className="hover:text-emerald-600 transition-colors">Home</Link>
          <Link to={"/products"} className="hover:text-emerald-600 transition-colors">All Products</Link>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-200 px-3 bg-gray-50 rounded-full focus-within:border-emerald-400 transition-all">
            <FiSearch className="text-gray-400" />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
          </div>

          {/* Cart */}
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer hover:scale-110 transition-transform">
            <FiShoppingCart className="text-xl text-emerald-600" />
            <button className="absolute -top-2.5 -right-3 text-[10px] font-bold text-white bg-emerald-500 w-[17px] h-[17px] rounded-full flex items-center justify-center">
              {cartCount()}
            </button>
          </div>

          {/* ── Profile Avatar + Stable Dropdown ── */}
          {user ? (
            <div ref={profileRef} style={{ position: "relative" }}>
              <div
                style={avatarStyle}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              {profileOpen && <ProfileDropdown />}
            </div>
          ) : (
            <button
              onClick={() => { setOpen(false); setShowUserLogin(true); }}
              className="cursor-pointer px-8 py-2 bg-emerald-500 hover:bg-emerald-600 transition-all text-white rounded-full font-semibold"
            >
              Login
            </button>
          )}
        </div>

        {/* ── Mobile top-right ── */}
        <div className="flex items-center gap-6 md:hidden">
          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <FiShoppingCart className="text-xl text-emerald-600" />
            <button className="absolute -top-2.5 -right-3 text-[10px] font-bold text-white bg-emerald-500 w-[17px] h-[17px] rounded-full flex items-center justify-center">
              {cartCount()}
            </button>
          </div>
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Menu"
            className="sm:hidden text-2xl text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <HiMenuAlt3 />
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={`${open ? "flex" : "hidden"} absolute top-[68px] left-0 w-full bg-white py-6 flex-col items-start gap-4 px-6 text-sm md:hidden z-40 border-t border-gray-100 rounded-b-2xl animate-dropIn`}>
          <Link onClick={() => setOpen(false)} to={"/"} className="w-full py-2 font-medium text-gray-700">Home</Link>
          <Link onClick={() => setOpen(false)} to={"/products"} className="w-full py-2 font-medium text-gray-700">Products</Link>

          {user ? (
            <div className="w-full mt-2 border-t border-gray-100 pt-4 space-y-2">
              <div className="flex items-center gap-3 px-1 py-1 mb-4">
                <div style={{ ...avatarStyle, width: "40px", height: "40px", fontSize: "14px" }}>
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <button onClick={() => { setOpen(false); navigate("/profile"); }} className="w-full text-left flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all cursor-pointer">
                <FiUser className="text-gray-400" /> My Profile
              </button>
              <button onClick={() => { setOpen(false); navigate("/my-orders"); }} className="w-full text-left flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all cursor-pointer">
                <FiPackage className="text-gray-400" /> My Orders
              </button>
              <button onClick={() => { setOpen(false); logout(); }} className="w-full text-left flex items-center gap-3 px-3 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setOpen(false); setShowUserLogin(true); }}
              className="w-full cursor-pointer py-3 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-xl font-bold"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
