import { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "../api/axiosConfig";
import CheckoutForm from "../forms/CheckoutForm";
import { AuthContext } from "../context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { email } = useContext(AuthContext);

  useEffect(() => {
    const loadCartAndCreateIntent = async () => {
      try {
        const resCart = await api.get("/cart");
        const items = resCart.data.items || [];

        const totalRsd = items.reduce(
          (sum: number, i: any) => sum + (i.totalPrice || 0),
          0
        );
        const totalEur = totalRsd / 117;
        const fixedTotal = Number(totalEur.toFixed(2));

        setAmount(fixedTotal);

        if (!email) {
          console.error(" Nema emaila u AuthContext-u!");
        } else {
          console.log(" Email koji se šalje Stripe-u:", email);
        }

        const resIntent = await api.post(
          "/payment/create",
          {
            amount: fixedTotal,
            email: email ?? "unknown@tailors.local",
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setClientSecret(resIntent.data.clientSecret);
      } catch (err) {
        console.error("Greška pri kreiranju Stripe plaćanja:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCartAndCreateIntent();
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-gray-400 text-lg">Učitavanje podataka o plaćanju...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-red-400 text-lg">
          Došlo je do greške pri pripremi plaćanja.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111827] text-white">
      <div className="p-8 rounded-lg bg-[#1f2937] shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Plaćanje</h1>
        <p className="text-center text-gray-300 mb-8">
          Ukupan iznos:{" "}
          <span className="text-green-400 font-bold text-lg">{amount}$</span>
        </p>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} />
        </Elements>
      </div>
    </div>
  );
};

export default StripePage;
