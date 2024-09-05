import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { query, collection, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from '../pages/Sidebar';
import '../style/wishlist.css';
import '../style/sidebar.css'; // Import the sidebar CSS
import Footer from "./Footer";
import Footpanel from "./footpanel";

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch wishlist items for the current user
                const q = query(
                    collection(db, 'wishlist'),  // Updated collection name
                    where('userId', '==', currentUser.uid)
                );

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const items = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setWishlistItems(items);
                } else {
                    console.log("No wishlist items found for user:", currentUser.uid);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleRemove = async (itemId) => {
        try {
            await deleteDoc(doc(db, 'wishlist', itemId));
            setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
            console.log("Item removed successfully");
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="wishlist-page">
                <Sidebar user={user} />
                <div className="wishlist-content">
                    <h1>Your Wishlist</h1>
                    {wishlistItems.length > 0 ? (
                        <ul className="wishlist-list">
                            {wishlistItems.map(item => (
                                <li key={item.id} className="wishlist-item">
                                    <img src={item.image} alt={item.productName} className="wishlist-item-image"/>
                                    <div className="wishlist-item-details">
                                        <h2>{item.productName}</h2>
                                        <p>NPR {item.price}</p>
                                        <button onClick={() => handleRemove(item.id)} className="remove-button">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Your wishlist is empty.</p>
                    )}
                </div>
            </div>
            <Footpanel />
            <Footer />
        </div>
    );
};

export default WishlistPage;
