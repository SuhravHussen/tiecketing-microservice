"use client";
import { toast } from "react-toastify";
import React, { useState } from "react";
import {
  Elements,
  useStripe,
  CardElement,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const MyForm = ({ orderId }) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded
      return;
    }

    try {
      const CardElement = elements.getElement("card");

      const { token } = await stripe.createToken(CardElement);

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token?.id,
          orderId,
        }),
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Payment successful");
        setTimeout(() => {
          router.push("/myorders");
        }, 2000);
      } else {
        const { message } = await res.json();
        setError(message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "calc(100% - 2rem)",
      }}
    >
      {/* Your form fields here */}
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "20px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
          },
        }}
      />

      <button
        className="text-xl btn-success p-2 rounded-md mt-2"
        type="submit"
        disabled={!stripe}
      >
        PAY NOW
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

const WrappedForm = ({ orderId }) => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    return <p>Something went wrong</p>;
  }

  console.log("coming");

  const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

  return (
    <Elements stripe={stripePromise}>
      <MyForm orderId={orderId} />
    </Elements>
  );
};
export default WrappedForm;
