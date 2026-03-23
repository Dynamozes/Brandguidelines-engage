import React from 'react';
import { Home } from 'lucide-react';

/* 
  Navbar receives activeLens so it can dim slightly when a lens is fully active,
  keeping the world immersive.
*/
const Navbar = ({ activeLens, setActiveLens }) => (
  <nav className={`navbar${activeLens ? ' dimmed' : ''}`}>
    {/* Logo */}
    <a href="#home" className="navbar-logo">
      {/* White SVG wordmark — swap src for the actual logo file when available */}
      <svg
        width="120"
        height="28"
        viewBox="0 0 120 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Gravity Engage"
      >
        {/* G mark — small diamond */}
        <rect x="0" y="8" width="12" height="12" rx="1" transform="rotate(45 6 14)" fill="white" opacity="0.90" />
        <rect x="3" y="11" width="6" height="6" rx="0.5" transform="rotate(45 6 14)" fill="#050507" />
        {/* Wordmark */}
        <text
          x="22"
          y="18"
          fontFamily="'Outfit', sans-serif"
          fontSize="13"
          fontWeight="500"
          letterSpacing="2"
          fill="rgba(255,255,255,0.88)"
        >
          GRAVITY ENGAGE
        </text>
      </svg>
    </a>

    {/* Right nav links */}
    <div className="navbar-links">
      <a 
        href="#home" 
        className="navbar-link navbar-home"
        onClick={(e) => { e.preventDefault(); setActiveLens(null); }}
      >
        <Home size={16} strokeWidth={1.5} />
      </a>
      <a href="#about"   className="navbar-link">About Us</a>
      <a href="#contact" className="navbar-link">Contact Us</a>
    </div>
  </nav>
);

export default Navbar;
