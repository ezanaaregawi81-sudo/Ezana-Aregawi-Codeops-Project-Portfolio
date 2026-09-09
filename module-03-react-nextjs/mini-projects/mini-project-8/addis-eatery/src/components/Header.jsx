import CartBadge from "./CartBadge";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/themeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <Link to="/" className="brand">Addis Eatery</Link>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        <NavLink to="/checkout">Checkout</NavLink>
      </nav>
      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <CartBadge />
    </header>
  );
}
