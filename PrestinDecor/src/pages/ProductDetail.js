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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      {/* <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/products">All Products</Link> &gt; <span>{product.name}</span>
      </div> */}
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
              {product.colors && product.colors.map((color, index) => (
                <div key={index} className="color-swatch" style={{ backgroundColor: color }}></div>
              ))}
            </div>
            <div className="quantity">
              <button>-</button>
              <input type="text" value="1" readOnly />
              <button>+</button>
            </div>
          </div>
          <button className="add-to-cart">Add to Cart</button>
          <button className="buy-now">Buy Now</button>
        </div>
      </div>
      <div className="product-meta">
        {/* <p>Product ID: {product.id}</p> */}
      </div>
      <Footpanel />
      <Footer />
    </div>
  );
};

export default ProductDetails;
