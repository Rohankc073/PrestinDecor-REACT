import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import '../style/signup.css';
import LoginImg from '../images/login.png';

const SignupPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !phoneNumber || !fullName) {
            setError("Please fill in all the fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                phoneNumber: phoneNumber,
                fullName: fullName,
            });

            const cartRef = await addDoc(collection(firestore, 'carts'), {
                userId: user.uid,
                name: user.email,
                createdAt: new Date(),
            });

            console.log('New cart created with ID:', cartRef.id);

            setEmail("");
            setPhoneNumber("");
            setFullName("");
            setPassword("");
            setConfirmPassword("");
            setError(null);
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("Email address is already in use. Please use a different email or try logging in.");
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="signup-header">
                    <h1>Hi There!</h1>
                    <p>Welcome to PrestinDecor</p>
                </div>
                {success ? (
                    <div className="success-message">Sign up successful! Redirecting to login...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="signup-form">
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="showPassword">Show Password</label>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="signupButton">Sign Up</button>
                    </form>
                )}
                <div className="login-link">
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>
            </div>
            <div className="signup-right">
                <div className="right-content">
                    <img src={LoginImg} alt="Furniture" className="right-image" />
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
