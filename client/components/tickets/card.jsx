import CardButton from "./cardButton";

const Card = ({ ticket }) => {
  return (
    <div className="card w-96 bg-light shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{ticket.title}</h2>
        <p>
          Buy ticket to attend the event. The price of the ticket is
          <span className="font-extrabold"> ${ticket.price}</span> dollars. You
          can pay with cards 💳.
        </p>
        <div className="card-actions justify-end">
          <CardButton ticket={ticket} />
        </div>
      </div>
    </div>
  );
};

export default Card;
