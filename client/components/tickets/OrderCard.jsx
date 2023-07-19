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
        <h2 className="card-title">{order?.ticket?.title}</h2>
        <p>
          You have successfully ordered the ticket. The price of the ticket is
          <span className="font-extrabold"> ${order?.ticket?.price}</span>{" "}
          dollars.
        </p>
        <div className="card-actions justify-end">
          <p
            className={`${
              orderStatus === "cancelled" ? "bg-red-500" : "bg-green-300"
            }  p-2 rounded-md`}
          >
            {orderStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
