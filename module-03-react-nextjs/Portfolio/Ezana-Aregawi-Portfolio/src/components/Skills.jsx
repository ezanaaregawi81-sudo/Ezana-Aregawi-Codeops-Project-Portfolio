import React, { useState } from 'react';

export const Skills = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="section skills-section">
      <div className="section-container">
        <h2 className="section-title">Skills & Technologies</h2>
        
        {/* Category Filters */}
        <div className="skills-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skill Pills Grid */}
        <ul className="skills-list">
          {filteredSkills.map((skill) => (
            <li key={skill.name} className="skill-item">
              <span className="skill-dot"></span>
              <span className="skill-name">{skill.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
