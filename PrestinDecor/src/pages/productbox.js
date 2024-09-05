// ProductBox.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../style/productbox.css';

const ProductBox = ({ product, handleAddToCart, handleAddToWishlist }) => {
    const addToCart = () => {
        console.log('Adding to cart:', product);
        handleAddToCart(product);
    };

    return (
        <div className="box1 box34">
            <div className="box-contxent">
                <div className="button-container123">
                    <div className="tooltip2">
                        <button className="love-button12" onClick={() => handleAddToWishlist(product)}>
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <div className="tooltiptext2">Add to Wishlist</div>
                    </div>
                    <div className="tooltip12">
                        <button className="add-to-cart-button" onClick={addToCart}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <div className="tooltiptext12">Add to Cart</div>
                    </div>
                </div>
                <Link to={`/products/${product.id}`}>
                    <div className="box-image123" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                </Link>
                <div className="caption1">
                    <h3 className="product-card-title">{product.name}</h3>
                    <div className="Category"><span>Category:</span> {product.category}</div>
                    <div className="pricingBox">
                        <div className="salePrice">
                            <span className="currency">NRP</span>
                            <span className="amount">{product.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductBox;
