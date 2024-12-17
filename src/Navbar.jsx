import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const [activeSection, setisActiveSection] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Track the currently visible section
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
      root: null, // Use the viewport as the root
      threshold: 0.6, // Trigger when 60% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setisActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 170; // Value to match the navbar height to enable smooth scrolling when link is clicked on menu
       const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsNavOpen(false); // Close navbar after clicking a link
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle the navbar state
  };

  return (
    <>
      <header>
        <h1 className="portfolio-heading">My Portfolio</h1>
      </header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNav}
            aria-controls="navbarNav"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
            {/* Centering the navbar links */}
            <ul className="navbar-nav mx-auto justify-content-around">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('about');
                  }}
                >
                  About Me
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('services');
                  }}
                >
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('projects');
                  }}
                >
                  Projects
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('contact');
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;