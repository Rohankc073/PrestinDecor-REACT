import React from 'react';
import '../style/footer.css';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <h1>PRESTINDECOR</h1>
                <p>
                    Donec mattis porta eros, aliquet finibus risus interdum at. Nulla vivethe as it was for us to know what was to be done. the this is a long post for the text. This small text has to be place here, since this is
                </p>
                <div className="social-icons">
                    <FaFacebookF />
                    <FaInstagram />
                    <FaTwitter />
                </div>
            </div>
            <div className="footer-links">
                <div className="link-column">
                    <p>About us</p>
                    <p>Services</p>
                    <p>Blog</p>
                    <p>Contact us</p>
                </div>
                <div className="link-column">
                    <p>Support</p>
                    <p>Knowledge base</p>
                    <p>Live chat</p>
                </div>
                <div className="link-column">
                    <p>Jobs</p>
                    <p>Our team</p>
                    <p>Leadership</p>
                    <p>Privacy Policy</p>
                </div>
                <div className="link-column">
                    <p>Nordic Chair</p>
                    <p>Kruzo Aero</p>
                    <p>Ergonomic</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
