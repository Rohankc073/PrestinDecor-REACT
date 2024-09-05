import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase'; // Ensure this is correctly pointing to your Firebase setup
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../style/ContactPage.css';
import image1 from '../images/image.png';
import Footer from "./Footer";
import Footpanel from "./footpanel";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
      alert('Please log in to send feedback.');
      return;
    }
    try {
      const feedbackCollection = collection(firestore, 'feedback');
      await addDoc(feedbackCollection, {
        ...formData,
        userId: user.uid,
        timestamp: new Date()
      });
      alert('Your message has been sent!');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the form
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact us</h1>
      <p>Fill out the form below and we will reply within 24 hours</p>
      <div className="form-image-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Send message</button>
        </form>
        <div className="contact-image">
          <img src={image1} alt="Contact" />
        </div>
      </div>
      <Footpanel />
      <Footer />
    </div>
  );
};

export default ContactPage;
