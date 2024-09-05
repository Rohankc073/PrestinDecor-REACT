// Sidebar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';  // Make sure to import your Firebase auth instance
import '../style/sidebar.css';  // Create a CSS file for sidebar styles

const Sidebar = ({ user }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (!user) {
            setPopupMessage('You need to log in first to log out.');
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 3000); // Show popup for 3 seconds
            return;
        }

        try {
            await signOut(auth);
            setPopupMessage('You have logged out of the system.');
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 3000); // Show popup for 3 seconds
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="sidebar">
            <div className="user-info">
                <div className="user-avatar">
                    <span className="user-initials">{user?.email.charAt(0).toUpperCase()}</span>
                </div>
                {/* <div className="user-name">{user?.displayName || 'User'}</div> */}
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/accounts">Personal info</Link></li>
                    <li><Link to="/orders">Orders</Link></li>
                    <li><Link to="/wishlist">Wish List</Link></li>
                    <li><Link to="/address">Addresses</Link></li>
                    <li><button onClick={handleLogout} className="logout-button">Log out</button></li>
                </ul>
            </nav>
            {showPopup && (
                <div className="popup">
                    <p>{popupMessage}</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
