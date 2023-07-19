"use client";

import OrderCard from "@/components/tickets/OrderCard";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(false);

  const router = useRouter();

  async function getUserOrders() {
    try {
      setError(false);
      const res = await fetch("/api/orders/", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      const orders = await res.json();

      setOrders(orders.data ? orders.data : []);
    } catch (e) {
      setError(true);
      console.log(e);
    }
  }

  useEffect(() => {
    async function getUser() {
      try {
        let user = await getCurrentUser();
        if (!user || !user.data || !user.data.id) {
          router.push("/");
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getUser();
    if (!loading) {
      getUserOrders();
    }
  }, [loading]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "inherit",
        }}
        className="flex justify-center items-center flex-wrap gap-5"
      >
        <h1 className="text-2xl">Authenticating...</h1>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "inherit",
      }}
      className="flex justify-center items-center flex-wrap gap-5"
    >
      {!error &&
        !loading &&
        orders.map((order) => <OrderCard key={order.id} order={order} />)}

      {error && <div>Something went wrong</div>}

      {!orders.length && !error && (
        <div className="flex justify-center items-center">
          <div className="text-4xl">No orders found</div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
