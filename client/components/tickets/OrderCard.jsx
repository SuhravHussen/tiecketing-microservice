"use client";

const OrderCard = ({ order }) => {
  let orderStatus = "";

  if (order.status === "created") {
    orderStatus = "payment pending";
  } else if (order.status === "cancelled") {
    orderStatus = "cancelled";
  } else if (order.status === "complete") {
    orderStatus = "complete";
  } else if (order.status === "awaiting:payment") {
    orderStatus = "payment pending";
  }

  return (
    <div className="card w-96 bg-light shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{ticket.title}</h2>
        <p>
          You have successfully ordered the ticket. The price of the ticket is{" "}
          {order?.ticket?.price}
          <span className="font-extrabold"> ${ticket.price}</span> dollars. You
          can pay with cards 💳.
        </p>
        <div className="card-actions justify-end">
          <p className="bg-green-300 p-2 rounded-md">{orderStatus}</p>
        </div>
      </div>
    </div>
  );
};
