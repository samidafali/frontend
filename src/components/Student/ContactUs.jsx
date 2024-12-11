import React, { useState } from 'react';
import './ContactUs.css';
import Main from '../Main/Main';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending message:', formData);
      setSuccessMessage('Your message has been sent successfully!');
      setErrorMessage('');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setErrorMessage('Failed to send your message. Please try again later.');
      setSuccessMessage('');
    }
  };

  // Gmail-specific link
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=yzahid911@gmail.com&su=Contact%20Us&body=Hi%20there,%0A%0AWrite%20your%20message%20here...%0A%0AThanks!`;

  return (
    <>
    <Main/>
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>
        Have questions or feedback? We'd love to hear from you! Reach us at{' '}
        <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="email-link">
          yzahid911@gmail.com
        </a>
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" className="send-button">
          Send Message
        </button>
      </form>
    </div>
    </>
  );
};

export default ContactUs;
