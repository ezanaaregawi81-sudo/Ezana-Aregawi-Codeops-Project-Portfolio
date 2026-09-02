import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { personalInfo, navLinks, projects, skills, contactInfo } from './data/portfolioData';
import { useActiveSection } from './hooks/useActiveSection';

export default function App() {
  const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];
  const activeSection = useActiveSection(sectionIds);

  return (
    <div className="portfolio-app">
      <Navbar navLinks={navLinks} activeSection={activeSection} />
      <main>
        <Hero personalInfo={personalInfo} />
        <About bio={personalInfo.bio} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Contact contactInfo={contactInfo} />
      </main>
      <Footer name={personalInfo.name} />
    </div>
  );
}
