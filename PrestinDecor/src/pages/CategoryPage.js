import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import '../style/CategoryPage.css';
import heroImage from '../images/2150943530.jpg';
import Footer from "./Footer";
import Footpanel from "./footpanel";
import ProductBox from './productbox'; // Import the ProductBox component

const CategoryPage = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(firestore, 'products'), where("category", "==", name));
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    };

    fetchProducts();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [name]);

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Please log in to add the product to the cart.');
      console.log('User not logged in. Please log in to add to cart.');
      return;
    }

    console.log('User:', user);

    const { id, name: productName, price, imageUrl } = product;
    const quantity = 1;
    alert("Product Added to cart");

    try {
      const cartsRef = collection(firestore, 'carts');
      const userCartQuery = query(cartsRef, where('userId', '==', user.uid));
      const userCartSnapshot = await getDocs(userCartQuery);

      let userCartDoc;
      if (userCartSnapshot.empty) {
        const newCartRef = await addDoc(cartsRef, {
          userId: user.uid,
          createdAt: new Date(),
        });
        userCartDoc = newCartRef;
      } else {
        userCartDoc = userCartSnapshot.docs[0];
      }

      const userCartItemsRef = collection(firestore, 'carts', userCartDoc.id, 'items');
      await addDoc(userCartItemsRef, {
        productId: id,
        productName: productName,
        quantity: quantity,
        price: price || 0,
        totalprice: quantity * parseInt(price || 0),
        image: imageUrl || '',
      });

      console.log('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };

  const handleAddToWishlist = (id) => {
    console.log(`Added product ${id} to wishlist`);
  };

  return (
    <div className="category-page">
      <link href="https://fonts.googleapis.com/css2?family=Prosto+One&display=swap" rel="stylesheet"/>
      <div className="hero-container">
        <img
          className="hero-image"
          src={heroImage}
          alt="hero"
        />
        <div className="text-container">
        <div className="category-name">{name}</div>
          <nav className="breadcrumb">
            {/* <Link to="/">Home</Link> &gt; <Link to="/product">Shop</Link> &gt; <span>{name}</span> */}
          </nav>
        </div>
      </div>
      <div className="products-container">
        {products.map(product => (
          <ProductBox
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleAddToWishlist={handleAddToWishlist}
          />
        ))}
      </div>
      <Footpanel />
      <Footer />
    </div>
  );
};

export default CategoryPage;
