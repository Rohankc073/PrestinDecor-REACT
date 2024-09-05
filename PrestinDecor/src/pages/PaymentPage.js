import React, { useEffect, useState } from 'react';
import '../style/PaymentPage.css'; // Ensure to create this CSS file
import Footer from "./Footer";
import Footpanel from "./footpanel";
import heroImage from '../images/2150943530.jpg';
import { auth, db, doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        country: 'Nepal',
        streetAddress: '',
        city: '',
    
        zipCode: '',
        phoneNumber: '',
        email: '',
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch user info from Firestore
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setFormData((prevData) => ({
                        ...prevData,
                        fullName: userData.fullName || '',
                        phoneNumber: userData.phoneNumber || '',
                        email: userData.email || currentUser.email,
                        streetAddress: userData.address?.streetAddress || '',
                        city: userData.address?.city || '',
                       
                        zipCode: userData.address?.zipCode || '',
                        country: userData.address?.country || 'Nepal'
                    }));
                } else {
                    setFormData((prevData) => ({
                        ...prevData,
                        email: currentUser.email
                    }));
                }

                // Fetch cart items
                fetchCartItems(currentUser.uid);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchCartItems = async (userId) => {
        try {
            const cartsRef = collection(db, 'carts');
            const userCartQuery = query(cartsRef, where('userId', '==', userId));
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

                setCartItems(userCartItems);

                const newTotalAmount = userCartItems.reduce((total, item) => {
                    return total + (item.price || 0) * (item.quantity || 1);
                }, 0);
                setTotalAmount(newTotalAmount);
            } else {
                setCartItems([]);
                setTotalAmount(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveAddress = async () => {
        if (!user) {
            console.log('User is not logged in');
            return;
        }

        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: {
                    streetAddress: formData.streetAddress,
                    city: formData.city,
                    
                    zipCode: formData.zipCode,
                    country: formData.country
                }
            }, { merge: true });
            console.log('Address saved:', formData);
            alert('Address saved successfully!');
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            console.log('User is not logged in');
            return;
        }

        const orderData = {
            ...formData,
            userId: user.uid,
            orderDate: new Date().toISOString(),
            items: cartItems,
            totalAmount: totalAmount,
            paymentMethod: 'COD'
        };

        try {
            // Save order to Firestore
            await setDoc(doc(db, 'orders', `${user.uid}_${new Date().getTime()}`), orderData);
            console.log('Order saved:', orderData);

            // Remove items from cart
            const cartQuery = query(collection(db, 'carts'), where('userId', '==', user.uid));
            const cartSnapshot = await getDocs(cartQuery);
            cartSnapshot.forEach(async (doc) => {
                const userCartItemsRef = collection(db, 'carts', doc.id, 'items');
                const userCartItemsSnapshot = await getDocs(userCartItemsRef);
                userCartItemsSnapshot.forEach(async (itemDoc) => {
                    await deleteDoc(itemDoc.ref);
                });
                await deleteDoc(doc.ref);
            });

            // Clear cart items in state
            setCartItems([]);
            setTotalAmount(0);

            // Show popup and redirect after delay
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 3000); // 3 seconds delay

        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    return (
        <div className="payment-page">
            <div className="hero-section">
                <img className="hero-image" src={heroImage} alt="hero" />
                <h1 className="page-title">Shipping Address</h1>
            </div>
            <nav className="breadcrumb">
                {/* <a href="/">Home</a> &gt; <a href="/shop">Shop</a> &gt; <a href="/living-room">Living Room</a> &gt; <a href="/cart">Cart</a> &gt; <span>Billing Details</span> */}
            </nav>
            <div className="form-container">
                <form className="shipping-form" onSubmit={handleSubmit}>
                    <div className="left-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name (Optional)</label>
                            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country / Region</label>
                            <select id="country" name="country" value={formData.country} onChange={handleChange} required>
                                <option value="Nepal">Nepal</option>
                                {/* Add more country options as needed */}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="streetAddress">Street Address</label>
                            <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Town / City</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="zipCode">ZIP Code</label>
                            <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <button type="button" className="save-address-btn" onClick={handleSaveAddress}>Save Address</button>
                    </div>
                    
                    <div className="right-form">
                        <div className="address-summary">
                            <h2>Shipping Address</h2>
                            <p><strong>Full Name:</strong> {formData.fullName}</p>
                            <p><strong>Street Address:</strong> {formData.streetAddress}</p>
                            <p><strong>City:</strong> {formData.city}</p>
                        
                            <p><strong>ZIP Code:</strong> {formData.zipCode}</p>
                            <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                        </div>
                        <div className="cart-summary">
                            <h2>Cart Summary</h2>
                            <ul>
                                {cartItems.map(item => (
                                    <li key={item.id}>
                                        {item.productName} - {item.quantity} x NPR {item.price ? item.price.toFixed(2) : 0}
                                        <img src={item.image} alt={item.productName} className="cart-item-image1"/>
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total Amount:</strong> NPR {totalAmount.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
                            <button type="submit" className="confirm-pay-btn">Confirm Order</button>
                        </div>
                    </div>
                </form>
            </div>
            <Footpanel />
            <Footer />
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Thank you for your order!</h2>
                        <p>Your order will be delivered within 2-3 days.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
