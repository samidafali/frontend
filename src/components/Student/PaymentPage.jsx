import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import success from '../../images/success.png';

const PaymentPage = () => {
  const { courseId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessImage, setShowSuccessImage] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js hasn't loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      console.log("Sending request to backend to create checkout session...");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from backend:", response.data);

      const { clientSecret } = response.data;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.log("Payment error:", error.message);
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded:", paymentIntent.id);
        setSuccessMessage("Payment successful!");
        setShowSuccessImage(true);
        
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate(`/studentdashboard`);
        }, 3000);
      }
    } catch (error) {
      console.log("Error in payment process:", error.response ? error.response.data : error.message);
      setErrorMessage('Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  // Inline CSS for styling the form and elements
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f7f9fc',
    },
    formContainer: {
      backgroundColor: '#ffffff',
      padding: '30px',
      maxWidth: '450px',
      width: '100%',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
    },
    title: {
      color: '#333',
      fontSize: '24px',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: '600',
    },
    stripeElement: {
      backgroundColor: '#fafafa',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      marginBottom: '20px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '5px',
      width: '100%',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '-15px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    success: {
      color: '#4CAF50',
      fontSize: '14px',
      marginTop: '-15px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    successImage: {
      width: '100%', // Adjust the width as needed
      marginBottom: '20px',
      borderRadius: '5px', // Optional: round the corners
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Optional: add shadow
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Complete your Payment</h2>
        <form onSubmit={handleSubmit}>
          <CardElement style={styles.stripeElement} />
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
          {successMessage && <div style={styles.success}>{successMessage}</div>}
          
          {showSuccessImage && <img src={success} alt="Success" style={styles.successImage} />} {/* Image de succès */}
          
          <button 
            type="submit" 
            style={isProcessing ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
