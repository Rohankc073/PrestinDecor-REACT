import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure to import your firebase configuration
import CartPanel from './cartpanel';
import '../style/navbar.css';
import logo from "../images/loge.png";

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const openCartPanel = () => {
        setIsCartOpen(true);
    };

    const closeCartPanel = () => {
        setIsCartOpen(false);
    };

    const navigateToAccount = () => {
        if (isLoggedIn) {
            navigate('/accounts');
        } else {
            setShowLoginPopup(true);
        }
    };

    const navigateHome = () => {
        navigate('/');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    useEffect(() => {
        if (showLoginPopup) {
            const timer = setTimeout(() => {
                setShowLoginPopup(false);
                navigate('/login'); // Redirect to login page
            }, 1000); // 1 second delay
            return () => clearTimeout(timer);
        }
    }, [showLoginPopup, navigate]);

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={navigateHome} style={{ cursor: 'pointer' }}>
                <img src={logo} alt="Logo" />
                <div className="navbar-brand">
                    <h1>PrestinDecor</h1>
                    <p>FURNITURE</p>
                </div>
            </div>
            <ul className="navbar-links">
                {/* Apply 'active' class dynamically based on the current path */}
                <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                <li><Link to="/product" className={location.pathname === '/product' ? 'active' : ''}>Products</Link></li>
                <li><Link to="/FAQ" className={location.pathname === '/FAQ' ? 'active' : ''}>FAQ</Link></li>
                <li><Link to="/contactus" className={location.pathname === '/contactus' ? 'active' : ''}>Contact Us</Link></li>
            </ul>
            <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
            <div className="navbar-icons">
                <button className="cart-button" onClick={openCartPanel} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span className="cart-icon-css"></span>
                </button>
                <button className="account-button" onClick={navigateToAccount} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
            </div>
            {isCartOpen && ReactDOM.createPortal(
                <CartPanel isOpen={isCartOpen} onClose={closeCartPanel} />,
                document.body
            )}
            {showLoginPopup && (
                <div className="login-popup">
                    <div className="login-popup-content">
                        <h2>Login Required</h2>
                        <p>You must be logged in to access this section.</p>
                        <p>Redirecting to the login page...</p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
