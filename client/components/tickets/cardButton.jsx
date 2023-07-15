"use client";

import { headers } from "@/next.config";

const { useGlobalContext } = require("@/context/store");

const CardButton = ({ ticket }) => {
  const { user } = useGlobalContext();

  const onBuyTicket = async () => {
    try {
      if (!user.email || !user.id) {
        const doc = document.getElementById("my-modal-4");
        doc.checked = true;
      } else {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({
            ticketId: ticket.id,
          }),
        });
        if (res.status === 200 || res.status === 201) {
          const { id } = await res.json();
          window.location.href = `/orders/${id}`;
        }
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };
  return (
    <button onClick={onBuyTicket} className="btn btn-primary">
      Buy Now
    </button>
  );
};

export default CardButton;
