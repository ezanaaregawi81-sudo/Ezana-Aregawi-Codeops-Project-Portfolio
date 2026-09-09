import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/checkout', label: 'Checkout' },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { total, totalCount } = useCart();

  return (
    <header className={`header header-${theme}`}>
      <div className="header-top">
        <Link to="/" className="brand-link">Addis Eats</Link>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          Toggle Theme ({theme.toUpperCase()})
        </button>
      </div>

      <nav className="nav-bar" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-summary">
        <span>{totalCount} items in cart</span>
        <span>Total: {total} ETB</span>
      </div>
    </header>
  );
}
