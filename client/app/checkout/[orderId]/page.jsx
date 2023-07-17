"use client";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { useEffect, useState } from "react";

const CheckoutPage = ({ params }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      if (!user || !user.data || !user.data.id) {
        window.location.href = "/";
      } else {
        setAuthenticated(true);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (timeLeft && timeLeft <= 0) {
      window.location.href = "/";
    }
  }, [timeLeft]);

  useEffect(() => {
    const getOrderData = async () => {
      try {
        setError("");
        const order = await fetch("/api/orders/" + params.orderId, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (order.status === 401) {
          window.location.href = "/";
          return;
        }
        const { data } = await order.json();
        if (data.status === "complete" || data.status === "cancelled") {
          window.location.href = "/";
        }

        const msLeft = new Date(data.expiresAt) - new Date();
        setTimeLeft(Math.round(msLeft / 1000));

        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
          clearInterval(timerId);
        };
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    getOrderData();
  }, []);

  if (!authenticated) {
    return (
      <div
        style={{ minHeight: "inherit" }}
        className="text-2xl flex justify-center items-center"
      >
        authenticating...
      </div>
    );
  }

  const onCancel = () => {
    window.location.href = "/";
  };

  return (
    <div
      style={{ minHeight: "inherit" }}
      className="text-2xl flex justify-center items-center"
    >
      <div className="card w-96 bg-purple shadow-md">
        <div className="card-body items-center text-center">
          <h2 className="card-title">PAY!</h2>
          <p className="text-lg m-2">
            Pay with your card to buy This Ticket. You have {timeLeft} seconds
            to pay.
          </p>
          {!error && (
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Pay</button>
              <button onClick={onCancel} className="btn btn-ghost">
                Cancel
              </button>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
