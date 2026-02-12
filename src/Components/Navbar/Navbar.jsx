import "./Navbar.css";
import logo from "../Assets/logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faBasketShopping,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout, loading } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  // ⏳ Wait until auth state restores
  if (loading) return null;

  // 🛒 Cart count
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" />
        <span>MYQ</span>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>

      {/* Menu */}
      <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <li onClick={() => setMenuOpen(false)}>
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
        </li>

        <li onClick={() => setMenuOpen(false)}>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
        </li>

        <li onClick={() => setMenuOpen(false)}>
          <NavLink to="/appointment" className="nav-link">
            Appointment
          </NavLink>
        </li>

        <li onClick={() => setMenuOpen(false)}>
          <NavLink to="/aboutus" className="nav-link">
            About Us
          </NavLink>
        </li>
      </ul>

      {/* Login / Logout / Admin / Cart */}
      <div className="nav-login-cart">
        {/* Admin */}
        {user?.admin && (
          <NavLink to="/admin/dashboard" className="nav-link admin-link">
            <FontAwesomeIcon icon={faUserShield} /> Admin
          </NavLink>
        )}

        {/* Login / Logout */}
        {!user ? (
          <NavLink to="/login" className="nav-link login-btn">
            Login
          </NavLink>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}

        {/* Cart */}
        <Link to="/cart" className="cart-icon">
          <FontAwesomeIcon icon={faBasketShopping} />
        </Link>

        <span className="nav-cart-count">{totalQty}</span>
      </div>
    </nav>
  );
};

export default Navbar;

