
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Datame from './components/Datame';
import Me from './components/Me';
import Breathe from './components/Breathe';
import Contact from './components/Contact';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or default to light mode
    return localStorage.getItem('theme') === 'dark';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkMode(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsLoading(false);
  }, []);

  // Handle theme toggle with persistence
  const toggleDarkMode = useCallback(() => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, [darkMode]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'flows', 'breathe', 'contact', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }

      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container" onClick={() => scrollToSection('home')}>
            <div className="logo-icon">🌊</div>
            <div className="logo-text">
              <h1 className="app-title">Go With Flow</h1>
              <p className="app-subtitle">Embrace the natural rhythm of life</p>
            </div>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            className={`mobile-menu-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`} role="navigation">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'flows', label: 'Flows', icon: '📊' },
            { id: 'breathe', label: 'Breathe', icon: '🧘' },
            { id: 'contact', label: 'Contact', icon: '📧' },
            { id: 'about', label: 'About', icon: '💭' }
          ].map(({ id, label, icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(id);
              }}
              title={`Navigate to ${label}`}
              aria-label={`Navigate to ${label} section`}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>
      </header>

      <main className="main-content">
        <section id="home" className="hero-section">
          <div className="hero-content">
            <h2>Welcome to Flow</h2>
            <p>Discover the beauty of going with the flow. Let life guide you naturally.</p>
            <div className="hero-actions">
              <button
                className="cta-button primary"
                onClick={() => scrollToSection('flows')}
              >
                Start Your Journey
              </button>
              <button
                className="cta-button secondary"
                onClick={() => scrollToSection('breathe')}
              >
                Try Breathing
              </button>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="floating-element">🌊</div>
            <div className="floating-element">🧘</div>
            <div className="floating-element">🌱</div>
            <div className="floating-element">⚖️</div>
          </div>
        </section>

        <div id="flows">
          <Datame />
        </div>

        <div id="breathe">
          <Breathe />
        </div>

        <div id="contact">
          <Contact />
        </div>

        <div id="about">
          <Me />
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Go With Flow. Embrace the journey.</p>
          <div className="footer-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>Back to Top</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* Progress indicator */}
      <div className="scroll-progress">
        <div
          className="progress-bar"
          style={{
            width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
