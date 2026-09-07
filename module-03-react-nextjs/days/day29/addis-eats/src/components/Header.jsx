import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import useFetch from '../hooks/useFetch';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { total, totalCount, clearCart } = useCart();
  
  // Exercise 2: Using useFetch in a 2nd component to display menu statistics
  const { data: menuData, loading } = useFetch('menu.json');
  const totalAvailableDishes = menuData?.items ? menuData.items.length : 0;

  return (
    <header className={`header header-${theme}`} style={{
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      backgroundColor: theme === 'dark' ? '#1a202c' : '#edf2f7',
      color: theme === 'dark' ? '#ffffff' : '#2d3748',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome to Addis Eatery</h1>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: theme === 'dark' ? '#f6ad55' : '#3182ce',
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          Toggle Theme ({theme.toUpperCase()})
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
        <span>
          {loading ? 'Loading menu statistics...' : `Menu items available: ${totalAvailableDishes}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span><strong>Cart Summary:</strong> {totalCount} items ({total} ETB)</span>
          {totalCount > 0 && (
            <button 
              onClick={clearCart} 
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#e53e3e',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
