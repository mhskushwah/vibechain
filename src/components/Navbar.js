import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaUsers, FaTree, FaInfoCircle, FaSignOutAlt, FaDollarSign } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  // Logout function
  const handleLogout = () => {
    console.log("User logged out due to tab close or inactivity.");
    localStorage.removeItem('userToken'); // Example: Remove user session
    sessionStorage.clear(); // Clear session data
    navigate('/logout'); // Redirect to logout page
  };

  // Handle scrolling
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setScrollingDown(currentScrollPos > prevScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  // Handle logout when the tab is closed or inactive
  useEffect(() => {
    const handleTabClose = () => {
      handleLogout();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLogout(); // Logout when the tab is hidden
      }
    };

    window.addEventListener('beforeunload', handleTabClose);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Hide navbar on Home page
  if (location.pathname === '/') return null;

  return (
    <nav className={`navbar ${scrollingDown ? 'hide' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <a href="https://vibechain.vercel.app/" className="flex items-center">
            <img src="assets/RiseBNB_files/logo.png" className="h-14" alt="RiseBNB Logo" />
          </a>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links */}
        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li><Link to="/dashboard" className="nav-link"><FaTachometerAlt /> Dashboard</Link></li>
          <li><Link to="/myteam" className="nav-link"><FaUsers /> My Team</Link></li>
          <li><Link to="/communitytree" className="nav-link"><FaTree /> Community Tree</Link></li>
          <li><Link to="/communityinfo" className="nav-link"><FaInfoCircle /> Community Info</Link></li>
          <li><Link to="/recentincome" className="nav-link"><FaTachometerAlt /> Recent Income</Link></li>
          <li><Link to="/flashout" className="nav-link"><FaDollarSign /> Claim Income</Link></li>
          <li><button className="nav-link logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
