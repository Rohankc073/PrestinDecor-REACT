import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from '../pages/Sidebar';
import '../style/address.css';  // Ensure to create this CSS file
import '../style/sidebar.css';  // Import the sidebar CSS
import Footer from "./Footer";
import Footpanel from "./footpanel";

const AddressPage = () => {
    const [address, setAddress] = useState({
        fullName: '',
        streetAddress: '',
        city: '',
        province: '',
        zipCode: '',
        phone: '',
        email: ''
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch user address from Firestore
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setAddress(userData.address || {}); // Set the address data if available
                } else {
                    console.log("No address found for user:", currentUser.uid);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (user) {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, { address }, { merge: true });
                console.log('Address updated:', address);
                setEditMode(false);
            } catch (error) {
                console.error('Error updating address:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="address-page">
            <div className="content-container">
                <Sidebar user={user} />
                <div className="address-content">
                    <h1>Your Address</h1>
                    {address ? (
                        <div className="address-details">
                            <div className="form-group">
                                <label><strong>Full Name:</strong></label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={address.fullName}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label><strong>Street Address:</strong></label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={address.streetAddress}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label><strong>City:</strong></label>
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label><strong>Province:</strong></label>
                                <input
                                    type="text"
                                    name="province"
                                    value={address.province}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label><strong>ZIP Code:</strong></label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={address.zipCode}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label><strong>Phone:</strong></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={address.phone}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label><strong>Email:</strong></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={address.email}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>
                            {editMode ? (
                                <button onClick={handleSave} className="save-button">Save</button>
                            ) : (
                                <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
                            )}
                        </div>
                    ) : (
                        <p>No address found.</p>
                    )}
                </div>
            </div>
            <Footpanel />
            <Footer />
        </div>
    );
};

export default AddressPage;
