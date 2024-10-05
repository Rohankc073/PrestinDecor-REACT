import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../style/ProductDetails.css';
import Footer from "./Footer";
import Footpanel from "./footpanel";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDocRef = doc(firestore, 'products', id);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        setProduct({ id: productDoc.id, ...productDoc.data() });
      } else {
        console.log('No such document!');
      }
    };

    fetchProductDetails();
  }, [id]);

  // Add handler for Add to Cart
  const handleAddToCart = () => {
    alert("Product added to cart!");
  };

  // Add handler for Buy Now
  const handleBuyNow = () => {
    alert("Proceeding to checkout!");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Set default colors if no colors are provided in the product
  const defaultColors = ['black', 'brown', 'grey'];
  const productColors = product.colors && product.colors.length > 0 ? product.colors : defaultColors;

  return (
      <div className="product-details">
        <div className="product-main">
          <div className="product-images">
            <img src={product.imageUrl} alt={product.name} className="main-image" />
            <div className="thumbnail-images">
              {product.thumbnails && product.thumbnails.map((thumbnail, index) => (
                  <img key={index} src={thumbnail} alt={`Thumbnail ${index}`} className="thumbnail" />
              ))}
            </div>
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="product-price">NPR {product.price}</p>
            <div className="product-rating">
              <span>Rating: {product.rating}</span>
            </div>
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            <div className="product-options">
              <div className="colors">
                <span>Colors: </span>
                {productColors.map((color, index) => (
                    <div
                        key={index}
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                        title={color}
                    ></div>
                ))}
              </div>
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
        <Footpanel />
        <Footer />
      </div>
  );
};

export default ProductDetails;
