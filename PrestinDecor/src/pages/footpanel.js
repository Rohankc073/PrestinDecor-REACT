import React from 'react';
import '../style/footpanel.css';
import { FaTrophy, FaShieldAlt, FaShippingFast, FaHeadset } from 'react-icons/fa';

const Features = () => {
    return (
        <div className="features">
            <div className="feature-item">
                <FaTrophy className="feature-icon" />
                <div>
                    <h3>High Quality</h3>
                    <p>crafted from top materials</p>
                </div>
            </div>
            <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <div>
                    <h3>Warranty Protection</h3>
                    <p>Over 2 years</p>
                </div>
            </div>
            <div className="feature-item">
                <FaShippingFast className="feature-icon" />
                <div>
                    <h3>Free Shipping</h3>
                    <p>Order over NPR 1,00,000</p>
                </div>
            </div>
            <div className="feature-item">
                <FaHeadset className="feature-icon" />
                <div>
                    <h3>24 / 7 Support</h3>
                    <p>Dedicated support</p>
                </div>
            </div>
        </div>
    );
};

export default Features;
