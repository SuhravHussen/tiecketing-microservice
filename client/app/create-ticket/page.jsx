"use client";

import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/store";
import { useState } from "react";

const createTicket = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [error, setError] = useState("");

  if (!user.email || !user.id) {
    router.push("/");

    return;
  }

  const onTicketCreate = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      setError("Please fill all the fields");
      return;
    }
    try {
      setError("");
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price,
        }),
      });

      if (res.status === 200 || res.status === 201) {
        alert("Ticket created successfully");
        e.reset();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        minHeight: "inherit",
      }}
      className="flex justify-center items-center"
    >
      <div className="shadow-md p-3 rounded-md">
        <h1 className="text-2xl mb-2">Create Ticket</h1>

        <form className="flex flex-col gap-3" onSubmit={onTicketCreate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of the event"
            className="input input-bordered input-secondary w-full max-w-xs bg-white"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price of the ticket in dollar"
            className="input input-bordered input-secondary w-full max-w-xs bg-white"
          />
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default createTicket;
