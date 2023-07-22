"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/tickets/card";
import { useGlobalContext } from "@/context/store";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const { user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setError("");
        const res = await fetch("/api/tickets/userticket", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.status === 200 || res.status === 201) {
          setTickets(data.data);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };
    fetchTickets();
  }, []);

  if (!user.email || !user.id) {
    router.push("/");
    return;
  }

  return (
    <div
      style={{
        minHeight: "inherit",
      }}
      className="flex justify-center items-center w-full"
    >
      <div className="shadow-md p-3 rounded-md w-full">
        <h1 className="text-2xl mb-2">My Tickets</h1>
        <div className="flex flex-wrap justify-center items-center gap-3 w-full">
          {tickets &&
            tickets.map((ticket) => (
              <Card key={ticket.id} ticket={ticket} button={false} />
            ))}
          {!tickets && <p className="text-center">No tickets found</p>}

          {error && <p className="text-center text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
