import React from 'react';

export const About = ({ bio }) => {
  return (
    <section id="about" className="section about-section">
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <p className="about-text">{bio}</p>
          <div className="about-highlights">
            <div className="highlight-card">
              <span className="highlight-number">Full-Stack</span>
              <span className="highlight-label">Developer Focus</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-number">Clean Code</span>
              <span className="highlight-label">Best Practices</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-number">Problem Solver</span>
              <span className="highlight-label">Real-World Apps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
