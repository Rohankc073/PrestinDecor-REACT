import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
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
            }, 1000); // 3 seconds delay
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
                <li><Link to="/" className="active">Home</Link></li>
                <li><Link to="/product">Products</Link></li>
                <li><a href="FAQ">FAQ</a></li>
                <li><a href="/contactus">Contact Us</a></li>
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
