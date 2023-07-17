"use client";

import { headers } from "@/next.config";
import { useRouter } from "next/navigation";

const { useGlobalContext } = require("@/context/store");

const CardButton = ({ ticket }) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const onBuyTicket = async () => {
    try {
      if (!user.email || !user.id) {
        const doc = document.getElementById("my-modal-4");
        doc.checked = true;
      } else {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId: ticket.id,
          }),
        });
        if (res.status === 200 || res.status === 201) {
          const { data } = await res.json();
          router.push(`/checkout/${data.id}`);
        } else {
          const { message } = await res.json();
          alert(message || "Something went wrong");
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
