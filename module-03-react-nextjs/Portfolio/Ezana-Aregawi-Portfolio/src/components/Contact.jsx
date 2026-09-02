import React, { useState } from 'react';

export const Contact = ({ contactInfo }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="section-container">
        <h2 className="section-title">Contact Me</h2>
        <p className="contact-subtitle">Interested in working together or have a question? Reach out below!</p>

        <div className="contact-grid">
          {/* Direct Links Card */}
          <div className="contact-card">
            <h3>Get In Touch</h3>
            <ul className="contact-list">
              <li>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${contactInfo.email}`} className="contact-link">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">💻</span>
                  <div>
                    <span className="contact-label">GitHub</span>
                    <a 
                      href={contactInfo.github.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="contact-link"
                    >
                      {contactInfo.github.label}
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <div>
                    <span className="contact-label">LinkedIn</span>
                    <a 
                      href={contactInfo.linkedin.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="contact-link"
                    >
                      {contactInfo.linkedin.label}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Message Form */}
          <div className="contact-card form-card">
            <h3>Send a Message</h3>
            {submitted ? (
              <div className="form-success">
                <span className="success-icon">✓</span>
                <h4>Thank you!</h4>
                <p>Your message has been sent successfully. I will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi Ezana, I'd like to talk about..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
