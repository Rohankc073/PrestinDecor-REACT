import React, { useState } from 'react';
import '../style/faq.css';  // Ensure to create this CSS file

import Footer from "./Footer";
import Footpanel from "./footpanel";
const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const questions = [
        {
            question: 'What is PrestinDecor?',
            answer: 'PrestinDecor is an online furniture store offering a wide range of furniture for living, dining, and bedroom areas.'
        },
        {
            question: 'How can I track my order?',
            answer: 'You can track your order by logging into your account and visiting the "Orders" section.'
        },
        {
            question: 'What is the return policy?',
            answer: 'We have a 30-day return policy. Please visit our Return Policy page for more details.'
        },
        {
            question: 'Do you offer international shipping?',
            answer: 'Currently, we only ship within Nepal. We are working on expanding our services to other countries.'
        },
        {
            question: 'How do I contact customer support?',
            answer: 'You can contact our customer support team via email at support@prestindecor.com or call us at 123-456-7890.'
        },
        {
            question: 'How can I cancel my order?',
            answer: 'You can cancel your order within 24 hours of placing it by visiting the "Orders" section in your account and selecting the cancel option.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept various payment methods including credit/debit cards, eSewa, and cash on delivery.'
        },
        {
            question: 'Do you provide assembly services?',
            answer: 'Yes, we offer assembly services for most of our furniture. Please check the product page for details on assembly services.'
        },
        {
            question: 'Can I change my delivery address after placing an order?',
            answer: 'Yes, you can change your delivery address before the order is shipped by contacting our customer support.'
        },
        {
            question: 'Do you offer any warranties on your products?',
            answer: 'Yes, we offer a one-year warranty on most of our products. Please refer to the product page for specific warranty information.'
        }
    ];

    const handleToggle = index => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-content">
                <h1>Frequently Asked Questions</h1>
                <ul className="faq-list">
                    {questions.map((item, index) => (
                        <li key={index}>
                            <div className="faq-question" onClick={() => handleToggle(index)}>
                                {item.question}
                                <span className={`arrow ${activeIndex === index ? 'down' : 'right'}`}></span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    {item.answer}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <Footpanel />
            <Footer />
        </div>
    );
};

export default FAQPage;
