import React from 'react';

export const ProjectCard = ({ project }) => {
  const { title, description, image, tags, demoUrl, githubUrl } = project;

  return (
    <article className="project-card">
      <div className="project-image-wrapper">
        <img 
          src={image} 
          alt={`${title} project thumbnail`} 
          className="project-image"
          loading="lazy"
        />
      </div>
      <div className="project-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        
        {tags && (
          <div className="project-tags">
            {tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        )}

        <div className="project-links">
          <a 
            href={demoUrl} 
            className="btn-small btn-primary"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Live Demo
          </a>
          <a 
            href={githubUrl} 
            className="btn-small btn-secondary"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Source Code
          </a>
        </div>
      </div>
    </article>
  );
};
