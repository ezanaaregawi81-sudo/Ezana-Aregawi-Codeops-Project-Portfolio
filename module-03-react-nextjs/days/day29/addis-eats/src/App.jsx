import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="app-container" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Header />
          <Main />
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
