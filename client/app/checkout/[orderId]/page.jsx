"use client";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { useEffect, useState } from "react";

const CheckoutPage = ({ params }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

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
    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [timeLeft]);

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
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Pay</button>
            <button onClick={onCancel} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
