"use client";

import Card from "@/components/tickets/card";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(false);

  const router = useRouter();

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
  }, []);

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
      {data.length &&
        data.map((ticket) => (
          <Card purchased key={ticket.id} ticket={ticket} />
        ))}

      {error && <div>Something went wrong</div>}

      {!orders.length && !error && (
        <div className="flex justify-center items-center">
          <div className="text-4xl">No orders found</div>
        </div>
      )}
    </div>
  );
};

async function getUserOrders() {
  try {
    setError(false);
    const res = await fetch("/api/orders/all", {
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

export default MyOrders;

const data = [
  {
    title: "zamshed majumdar",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T05:59:07.170Z",
    updatedAt: "2023-07-12T05:59:07.170Z",
    version: 0,
    id: "64ae412b606262d1c107b58e",
  },
  {
    title: "ahmadullah",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T05:59:23.335Z",
    updatedAt: "2023-07-12T05:59:23.335Z",
    version: 0,
    id: "64ae413b606262d1c107b590",
  },
  {
    title: "madani",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T05:59:36.345Z",
    updatedAt: "2023-07-12T05:59:36.345Z",
    version: 0,
    id: "64ae4148606262d1c107b592",
  },
  {
    title: "enamul haque",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T06:00:00.455Z",
    updatedAt: "2023-07-12T06:00:00.455Z",
    version: 0,
    id: "64ae4160606262d1c107b594",
  },
  {
    title: "saifuddin",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T06:00:14.406Z",
    updatedAt: "2023-07-12T06:00:14.406Z",
    version: 0,
    id: "64ae416e606262d1c107b596",
  },
  {
    title: "shamsul arefien",
    price: 10,
    userId: "64ae4103e94f55d8f70fe69e",
    createdAt: "2023-07-12T06:00:22.971Z",
    updatedAt: "2023-07-12T06:00:22.971Z",
    version: 0,
    id: "64ae4176606262d1c107b598",
  },
];
