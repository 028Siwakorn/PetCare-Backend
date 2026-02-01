import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

/**
 * Navbar - แถบเมนูบน (มือถือใช้ drawer)
 */
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "หน้าแรก" },
    { to: "/booking", label: "จองบริการ" },
    { to: "/history", label: "ประวัติการจอง" },
  ];

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <label
          htmlFor="drawer-nav"
          className="btn btn-ghost btn-square drawer-button lg:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <Link to="/" className="btn btn-ghost text-lg font-bold text-primary">
          🐾 Pet Care
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm text-base-content/70 truncate max-w-[120px]">
              {user.username}
            </span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button size="sm" variant="ghost">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary">
                สมัครสมาชิก
              </Button>
            </Link>
          </>
        )}
      </div>
      <input
        type="checkbox"
        id="drawer-nav"
        className="drawer-toggle"
        checked={drawerOpen}
        readOnly
      />
      <div className="drawer-side z-50">
        <label
          htmlFor="drawer-nav"
          className="drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        />
        <ul className="menu p-4 w-72 min-h-full bg-base-100 gap-2">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} onClick={() => setDrawerOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
          {user ? (
            <li>
              <button type="button" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setDrawerOpen(false)}>
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setDrawerOpen(false)}>
                  สมัครสมาชิก
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
