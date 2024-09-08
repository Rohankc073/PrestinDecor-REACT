import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import '../style/CategoryPage.css';
import heroImage from '../images/2150943530.jpg';
import Footer from "./Footer";
import Footpanel from "./footpanel";
import ProductBox from './productbox';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12; // Number of products per page

    useEffect(() => {
        const fetchProducts = async () => {
            const productSnapshot = await getDocs(collection(firestore, 'products'));
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
    }, []);

    // Calculate products for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate the total number of pages
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Pagination control handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const setPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            alert('Please log in to add the product to the cart.');
            console.log('User not logged in. Please log in to add to cart.');
            return;
        }

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

    const handleAddToWishlist = async (product) => {
        if (!user) {
            alert('Please log in to add the product to the wishlist.');
            console.log('User not logged in. Please log in to add to wishlist.');
            return;
        }

        const { id, name: productName, price, imageUrl } = product;
        alert("Product Added to wishlist");

        try {
            const wishlistRef = collection(firestore, 'wishlist');
            await addDoc(wishlistRef, {
                userId: user.uid,
                productId: id,
                productName: productName,
                price: price || 0,
                image: imageUrl || '',
                addedAt: new Date()
            });

            console.log('Item added to wishlist');
        } catch (error) {
            console.error('Error adding to wishlist:', error.message);
        }
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
                <div className="overlay-text">
                    <h1>All Products</h1>
                </div>
            </div>
            <div className="products-container">
                {currentProducts.map(product => (
                    <ProductBox
                        key={product.id}
                        product={product}
                        handleAddToCart={() => handleAddToCart(product)}
                        handleAddToWishlist={() => handleAddToWishlist(product)}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>

                {/* Generate page numbers */}
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setPage(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}

                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            <Footpanel />
            <Footer />
        </div>
    );
};

export default ProductsPage;
