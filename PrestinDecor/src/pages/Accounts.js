import React, { useState, useEffect } from 'react';
import { auth, db, doc, getDoc, setDoc } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import '../style/accounts.css';
import Footer from "./Footer";
import Footpanel from "./footpanel";
import Sidebar from '../pages/Sidebar';

const PersonalInfoPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        email: '',
        phoneNumber: '',
        verified: false
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setFormData((prevData) => ({
                    ...prevData,
                    email: currentUser.email,
                    verified: currentUser.emailVerified
                }));

                // Fetch user info from Firestore
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setFormData((prevData) => ({
                        ...prevData,
                        ...userData
                    }));
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to update your information.');
            return;
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, formData);
            alert('Your information has been updated!');
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="personal-info-page">
            <Sidebar user={user} />
                <div className="content">
                    <h1>Personal info</h1>
                    <form className="personal-info-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Date of birth</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="save-button">Save changes</button>
                    </form>
                </div>
            </div>
            <Footpanel />
            <Footer />
        </div>
    );
};

export default PersonalInfoPage;
