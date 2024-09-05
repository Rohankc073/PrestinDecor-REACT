import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AddProductPage from './pages/AddProductPage';
import ImageUploadPage from './pages/ImageUploadPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Navbar from './pages/navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signup';
import ProductDetails from './pages/ProductDetail';
import PersonalInfoPage from './pages/Accounts';
import PaymentPage from '../src/pages/PaymentPage'
import WishlistPage from '../src/pages/WishList'
import AddressPage from '../src/pages/Address'
import FAQPage from '../src/pages/FAQ'
import OrdersPage from '../src/pages/OrdersPage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/upload-image" element={<ImageUploadPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/contactus" element={<ContactPage />} />
        <Route path="/accounts" element={<PersonalInfoPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/address" element={<AddressPage />} /> 
        <Route path="/faq" element={<FAQPage />} />  // Add the route for FAQPage
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
