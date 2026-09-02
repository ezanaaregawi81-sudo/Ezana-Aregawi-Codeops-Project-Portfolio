import React from 'react';
import { ProjectCard } from './ProjectCard';

export const Projects = ({ projects }) => {
  return (
    <section id="projects" className="section projects-section">
      <div className="section-container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
