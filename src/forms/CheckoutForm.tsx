import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

type CheckoutFormProps = {
  amount: number;
};

const CheckoutForm = ({ amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:5173/payment-success",
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "Došlo je do greške prilikom plaćanja.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await api.post("/payment/confirm", { email: userEmail, paymentIntentId: paymentIntent.id, amount: amount, currency: "usd" });

        setMessage("Plaćanje uspešno! Porudžbina poslata.");
        navigate("/userDashboard");
      }
    } catch (err) {
      console.error(err);
      setMessage("Greška prilikom obrade plaćanja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Obrada..." : `Plati €${amount.toFixed(2)}`}
      </button>
      {message && <p className="text-center mt-3 text-blue-400">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
