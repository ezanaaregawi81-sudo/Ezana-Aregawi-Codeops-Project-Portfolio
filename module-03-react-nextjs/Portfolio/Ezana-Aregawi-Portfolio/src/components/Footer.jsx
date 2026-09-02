import React from 'react';

export const Footer = ({ name }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        <button 
          onClick={scrollToTop} 
          className="back-to-top-btn" 
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      </div>
    </footer>
  );
};
