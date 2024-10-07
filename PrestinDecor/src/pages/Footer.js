import React from 'react';
import '../style/footer.css';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <h1>PRESTINDECOR</h1>
                <p>
                    At Prestindecor, we believe in bringing elegance and comfort to your home. Our carefully curated furniture collection combines quality craftsmanship with modern designs to elevate any space. Discover the perfect blend of style and functionality with us.
                </p>
                <div className="social-icons">
                    <FaFacebookF />
                    <FaInstagram />
                    <FaTwitter />
                </div>
            </div>
            <div className="footer-links">
                <div className="link-column">
                    <p>About Us</p>
                    <p>Services</p>
                    <p>Blog</p>
                    <p>Contact Us</p>
                </div>
                <div className="link-column">
                    <p>Support</p>
                    <p>FAQs</p>
                    <p>Shipping & Returns</p>
                </div>
                <div className="link-column">
                    <p>Careers</p>
                    <p>Our Team</p>
                    <p>Leadership</p>
                    <p>Privacy Policy</p>
                </div>
                <div className="link-column">
                    <p>Living Room</p>
                    <p>Office Furniture</p>
                    <p>Bedroom</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
