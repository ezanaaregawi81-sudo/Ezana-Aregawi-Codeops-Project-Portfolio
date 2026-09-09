import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

function Card({ children }) {
 
  const { theme } = useTheme();

  const cardStyle = {
    padding: '1rem',
    borderRadius: '8px',
    margin: '0.5rem 0',
    backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
    color: theme === 'dark' ? '#f7fafc' : '#1a202c',
    border: theme === 'dark' ? '1px solid #4a5568' : '1px solid #e2e8f0',
    boxShadow: theme === 'dark' ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  };

  return (
    <div className={`card card-${theme}`} style={cardStyle}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
};

export default Card;
