import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <section className="contact-section">
      <h2>Get In Touch</h2>
      <p>Let's connect and flow together. Reach out with your thoughts, questions, or just to say hello.</p>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p>hello@gowithflow.com</p>
            <p>support@gowithflow.com</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>Phone</h3>
            <p>+1 (555) 123-FLOW</p>
            <p>Available Mon-Fri, 9AM-6PM</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Location</h3>
            <p>San Francisco, CA</p>
            <p>Embracing the digital flow worldwide</p>
          </div>

          <div className="info-card">
            <div className="info-icon">🌊</div>
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">🐦 Twitter</a>
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">💼 LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
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
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Choose a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Share your thoughts, questions, or how we can help you go with the flow..."
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitted}>
              {isSubmitted ? 'Message Sent! 🌊' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-quote">
        <blockquote>
          "The best way to find yourself is to lose yourself in the service of others."
        </blockquote>
        <cite>- Mahatma Gandhi</cite>
      </div>
    </section>
  );
};

export default Contact;