import React, { useEffect, useState } from 'react';
import { auth, db, collection, query, where, getDocs } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../style/OrdersPage.css'; // Ensure to create this CSS file
import Footer from "./Footer";
import Footpanel from "./footpanel";
import Sidebar from '../pages/Sidebar';

const OrdersPage = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchUserOrders(currentUser.uid);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserOrders = async (userId) => {
        try {
            const ordersRef = collection(db, 'orders');
            const userOrdersQuery = query(ordersRef, where('userId', '==', userId));
            const userOrdersSnapshot = await getDocs(userOrdersQuery);

            const userOrders = userOrdersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setOrders(userOrders);
        } catch (error) {
            console.error('Error fetching user orders:', error.message);
        }
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="orders-page">
                <Sidebar user={user} />
                <div className="orders-content">
                    <h1>Your Orders</h1>
                    {orders.length === 0 ? (
                        <p>You have no orders.</p>
                    ) : (
                        <ul className="orders-list">
                            {orders.map(order => (
                                <li key={order.id} className="order-item">
                                    {/* <h2>Order ID: {order.id}</h2> */}
                                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                    <p><strong>Total Amount:</strong> NPR {order.totalAmount.toFixed(2)}</p>
                                    <h3>Items:</h3>
                                    <ul className="order-items-list">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="order-item-detail">
                                                <img src={item.image} alt={item.productName} className="order-item-image"/>
                                                <div>
                                                    <p><strong>{item.productName}</strong></p>
                                                    <p>{item.quantity} x NPR {item.price.toFixed(2)}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footpanel />
            <Footer />
        </div>
    );
};

export default OrdersPage;
