import React from 'react';

export const Hero = ({ personalInfo }) => {
  const handleCtaClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-avatar-wrapper">
          <img 
            src={personalInfo.avatar} 
            alt={`${personalInfo.name} Profile`} 
            className="hero-photo"
            onError={(e) => {
              // Fallback placeholder avatar if image path fails
              e.target.onerror = null;
              e.target.src = "https://ui-avatars.com/api/?name=Ezana+Aregawi&background=9915bd&color=fff&size=200";
            }}
          />
        </div>
        <h1 className="hero-title">
          Hi, I'm <span className="highlight-name">{personalInfo.name}</span>
        </h1>
        <p className="tagline">{personalInfo.title}</p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary" onClick={handleCtaClick}>
            Hire Me
          </a>
          <a href="#projects" className="btn btn-secondary" onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            View Work
          </a>
        </div>
      </div>
    </section>
  );
};
