import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './PaymentForm.css';

const PaymentForm = ({ courseId, token, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js hasn't loaded yet.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { clientSecret } = response.data;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        onSuccess("Payment successful via Stripe!");
      }
    } catch (error) {
      setErrorMessage("Stripe payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Complete Your Payment</h2>
      <div className="payment-method-selector">
        <label>
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={() => setPaymentMethod("stripe")}
          />
          Pay with Stripe
        </label>
        <label>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
          />
          Pay with PayPal
        </label>
      </div>

      {paymentMethod === "stripe" && (
        <form onSubmit={handleStripePayment}>
          <CardElement className="StripeElement" />
          {errorMessage && <div className="error">{errorMessage}</div>}
          <button
            type="submit"
            disabled={isProcessing || !stripe}
            className={`payment-button ${isProcessing ? "disabled" : ""}`}
          >
            {isProcessing ? "Processing..." : "Pay with Stripe"}
          </button>
        </form>
      )}

      {paymentMethod === "paypal" && (
     <PayPalScriptProvider
     options={{
       "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, // Doit pointer vers la variable d'environnement
       currency: "USD", // Assurez-vous que la devise correspond à vos besoins
     }}
   >
     <PayPalButtons
       style={{ layout: "vertical" }}
       createOrder={handlePayPalOrder}
       onApprove={handlePayPalCapture}
       onError={() => setErrorMessage("An error occurred with PayPal. Please try again.")}
     />
   </PayPalScriptProvider>
   
      )}
    </div>
  );
};

export default PaymentForm;
