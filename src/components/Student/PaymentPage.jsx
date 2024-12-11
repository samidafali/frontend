import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './PaymentPage.css';

const PaymentPage = () => {
  const { courseId } = useParams(); // Récupère l'ID du cours depuis l'URL
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // Stripe par défaut
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Récupère le token d'authentification depuis le localStorage

  // Gestion du paiement avec Stripe
  const handleStripePayment = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js n'est pas encore chargé. Veuillez réessayer plus tard.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/create-checkout-session`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { clientSecret } = response.data;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setSuccessMessage("Paiement réussi via Stripe !");
        setTimeout(() => navigate("/studentdashboard"), 3000);
      }
    } catch (error) {
      setErrorMessage("Échec du traitement du paiement via Stripe. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Création d'une commande avec PayPal
  const handlePayPalOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/paypal/order`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.id; // Retourne l'ID de commande PayPal
    } catch (error) {
      setErrorMessage("Échec de la création de la commande PayPal. Veuillez réessayer.");
      setIsProcessing(false);
      throw error;
    }
  };

  // Capture d'un paiement PayPal approuvé
  const handlePayPalCapture = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/paypal/capture`,
        { orderId: data.orderID, courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Paiement réussi via PayPal !");
        setTimeout(() => navigate("/studentdashboard"), 3000);
      }
    } catch (error) {
      setErrorMessage("Échec de la capture du paiement PayPal. Veuillez réessayer.");
    }
  };

  return (
    <div className="payment-page-container">
      <h2 className="title">Complétez votre paiement</h2>
      <div className="payment-method-selector">
        <label>
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={() => setPaymentMethod("stripe")}
          />
          Payer avec Stripe
        </label>
        <label>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
          />
          Payer avec PayPal
        </label>
      </div>

      {paymentMethod === "stripe" && (
        <form onSubmit={handleStripePayment} className="stripe-form">
          <CardElement className="stripe-card-element" />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button
            type="submit"
            className={`submit-button ${isProcessing ? "disabled" : ""}`}
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? "Traitement..." : "Payer avec Stripe"}
          </button>
        </form>
      )}

      {paymentMethod === "paypal" && (
        <PayPalScriptProvider
          options={{
            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={handlePayPalOrder}
            onApprove={handlePayPalCapture}
            onError={() => setErrorMessage("Une erreur est survenue avec PayPal. Veuillez réessayer.")}
          />
        </PayPalScriptProvider>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default PaymentPage;
