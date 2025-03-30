import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importing useLocation hook
import { FaBars, FaTimes, FaTachometerAlt, FaUsers, FaTree, FaInfoCircle, FaSignOutAlt, FaDollarSign } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu
  const [scrollingDown, setScrollingDown] = useState(false); // State to check if scrolling down
  const [prevScrollPos, setPrevScrollPos] = useState(0); // Store the previous scroll position
  const location = useLocation(); // useLocation hook to get the current location

  // Function to handle scroll events
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset; // Get current scroll position
    if (currentScrollPos > prevScrollPos) {
      setScrollingDown(true); // Scrolling down
    } else {
      setScrollingDown(false); // Scrolling up
    }
    setPrevScrollPos(currentScrollPos); // Update previous scroll position
  };

  // Adding event listener for scroll event when component mounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  // Toggle menu function
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Check if current page is Home
  const isHomePage = location.pathname === '/'; // Home page check

  // Don't show navbar on Home page
  if (isHomePage) {
    return null; // Return null to hide the navbar on home page
  }

  return (
    <nav className={`navbar ${scrollingDown ? 'hide' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
        <a href="https://vibechain.pro/#" className="flex items-center">
              <img
                src="assets/RiseBNB_files/logo.png"
                className="h-14"
                alt="RiseBNB Logo"
              />
             
            </a>       
             </div>

        {/* Hamburger Menu Icon (Only for mobile) */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Menu links */}
        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li>
            <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>
              <FaTachometerAlt className="nav-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/myteam" className="nav-link" onClick={toggleMenu}>
              <FaUsers className="nav-icon" /> My Team
            </Link>
          </li>
          <li>
            <Link to="/communitytree" className="nav-link" onClick={toggleMenu}>
              <FaTree className="nav-icon" /> Community Tree
            </Link>
          </li>
          <li>
            <Link to="/communityinfo" className="nav-link" onClick={toggleMenu}>
              <FaInfoCircle className="nav-icon" /> Community Info
            </Link>
          </li>
          <li>
            <Link to="/recentincome" className="nav-link" onClick={toggleMenu}>
              <FaTachometerAlt className="nav-icon" /> Recent Income
            </Link>
          </li>
          <li>
            <Link to="/flashout" className="nav-link" onClick={toggleMenu}>
              <FaDollarSign className="nav-icon" /> Claim Income
            </Link>
          </li>
          <li>
            <Link to="/logout" className="nav-link" onClick={toggleMenu}>
              <FaSignOutAlt className="nav-icon" /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
