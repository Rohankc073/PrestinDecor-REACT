import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import '../style/cartpanel.css'; // Import CSS for CartPanel

const CartPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); // Get the navigate function
    const [user] = useAuthState(auth);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const fetchCartItems = async () => {
        if (!user) {
            console.log('User not logged in. Unable to fetch cart items.');
            return;
        }

        try {
            const cartsRef = collection(db, 'carts');
            const userCartQuery = query(cartsRef, where('userId', '==', user.uid));
            const userCartSnapshot = await getDocs(userCartQuery);

            if (!userCartSnapshot.empty) {
                const userCartDoc = userCartSnapshot.docs[0];
                const userCartItemsRef = collection(db, 'carts', userCartDoc.id, 'items');

                const userCartItemsSnapshot = await getDocs(userCartItemsRef);
                const userCartItems = userCartItemsSnapshot.docs.map((doc) => {
                    const itemData = doc.data();
                    return {
                        ...itemData,
                        id: doc.id,
                        cartId: userCartDoc.id, // Store cart ID for later use
                    };
                });

                console.log('User Cart Items:', userCartItems);
                setCartItems(userCartItems);

                const newTotalPrice = userCartItems.reduce((total, item) => {
                    return total + item.price * item.quantity;
                }, 0);
                setTotalPrice(newTotalPrice);
            } else {
                console.log('User has no cart.');
                setCartItems([]);
                setTotalPrice(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error.message);
        }
    };

    const handleRemoveFromCart = async (item) => {
        if (!user) {
            console.log('User not logged in. Unable to remove item from the cart.');
            return;
        }

        try {
            const itemDocRef = doc(db, 'carts', item.cartId, 'items', item.id);
            await deleteDoc(itemDocRef);

            console.log('Item removed from cart');
            fetchCartItems();
        } catch (error) {
            console.error('Error removing item from cart:', error.message);
        }
    };

    const handleAddMore = async (item) => {
        if (!user) {
            console.log('User not logged in. Unable to add more items to the cart.');
            return;
        }

        try {
            const itemDocRef = doc(db, 'carts', item.cartId, 'items', item.id);
            await updateDoc(itemDocRef, {
                quantity: item.quantity + 1,
            });

            console.log('Item quantity updated');
            fetchCartItems();
        } catch (error) {
            console.error('Error updating item quantity:', error.message);
        }
    };

    const handleSubtract = async (item) => {
        if (!user) {
            console.log('User not logged in. Unable to subtract items from the cart.');
            return;
        }

        if (item.quantity === 1) {
            handleRemoveFromCart(item);
            return;
        }

        try {
            const itemDocRef = doc(db, 'carts', item.cartId, 'items', item.id);
            await updateDoc(itemDocRef, {
                quantity: item.quantity - 1,
            });

            console.log('Item quantity updated');
            fetchCartItems();
        } catch (error) {
            console.error('Error updating item quantity:', error.message);
        }
    };

    // Handle "Buy Now" button click
    const handleBuyNow = () => {
        if (user) {
            navigate('/payment'); // Navigate to the payment page
        } else {
            alert('You must be logged in to buy a product.'); // Show alert if not logged in
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [user]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="cart-panel-overlay">
            <div className="cart-panel">
                <button className='back-button' onClick={onClose}>Back</button>

                <h1>Your Cart</h1>

                {/* Display empty cart message if no items */}
                {cartItems.length === 0 ? (
                    <p className="empty-cart-message">Your cart is empty.</p>
                ) : (
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id} className="cart-item">
                                <div className="cart-item-box">
                                    <img src={item.image} alt={item.productName} className="cart-item-image"/>
                                    <div className="cart-item-details">
                                        <p>{item.productName}</p>
                                        <div className="quantity-control">
                                            <button className="quantity-button" onClick={() => handleSubtract(item)}>-</button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="quantity-button" onClick={() => handleAddMore(item)}>+</button>
                                        </div>
                                        <p>Price: {item.price * item.quantity}</p>
                                        <button className="remove_btn" onClick={() => handleRemoveFromCart(item)}>Remove</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <p className="total-price">Total Price: {totalPrice}</p>
                <div className="button-container99">
                    <button className='buy_button' onClick={handleBuyNow}>Buy Now</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CartPanel;
