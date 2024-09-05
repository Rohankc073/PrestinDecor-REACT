import React from 'react';
import '../style/home.css';
import sofaImage from '../images/sofa1.png';
import living from '../images/ik.png';
import dining from '../images/din.png';
import bedroom from '../images/bed.png';
import Footer from "./Footer";
import Footpanel from "./footpanel";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`);
    };

    return (
        <div>
            <div className="App">
                <div className="header">
                    <div className="header-content">
                        <h1>Modern Interior<br/>Design Studio</h1>
                        <div className="buttons">
                            <button className="shop-btn">Shop Now</button>
                            <button className="explore-btn">Explore</button>
                        </div>
                    </div>
                    <img src={sofaImage} alt="Green Sofa" className="sofa-image"/>
                </div>
                <section className="main-content">
                    <h2>Shop By Room</h2>
                    <p className="main-description">Discover The Perfect Furnishings To Reflect Your Personal Taste And
                        Elevate Your Home's Aesthetic With Prestindoce.</p>
                    <div className="room-sections">
                        <div className="room living-room" onClick={() => handleCategoryClick('Living Room')}>
                            <img src={living} alt="Living Room" className="room-image"/>
                            <button className="category-button"><h3>Living Room</h3></button>
                            <p>Transform Your Living Room Into A Cozy, Stylish Retreat With Our Artistic Pieces. From
                                Plush Sofas To Statement Art, Our Selection Combines Comfort And Elegance To Create The
                                Perfect Space for Relaxation And Entertaining.</p>
                        </div>
                        <div className="room dining-room" onClick={() => handleCategoryClick('Dining Room')}>
                            <img src={dining} alt="Dining Room" className="room-image"/>
                            <button className="category-button"><h3>Dining Room</h3></button>
                            <p>Elevate Your Dining Experience With Our Exquisite Dining Room Furniture. Crafted With
                                Meticulous Care, Our Tables And Chairs Bring Sophistication And Functionality To Every
                                Meal.</p>
                        </div>
                        <div className="room bedroom" onClick={() => handleCategoryClick('Bedroom')}>
                            <img src={bedroom} alt="Bedroom" className="room-image"/>
                            <button className="category-button"><h3>Bedroom</h3></button>
                            <p>Create Your Dream Bedroom With Our Curated Selection of Furniture. Crafted With
                                Excellence From The Finest Materials, Our Pieces Promise Restful Nights And Stylish Mornings.</p>
                        </div>
                    </div>
                </section>
                <Footpanel/>
                <Footer/>
            </div>
        </div>
    );
};

export default HomePage;
