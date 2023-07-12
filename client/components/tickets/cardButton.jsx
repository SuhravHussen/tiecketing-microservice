"use client";

const { useGlobalContext } = require("@/context/store");

const CardButton = ({ ticket }) => {
  const { user } = useGlobalContext();

  const onBuyTicket = async () => {
    if (!user.email || !user.id) {
      const doc = document.getElementById("my-modal-4");
      doc.checked = true;
    } else {
      alert("You are logged in");
    }
  };
  return (
    <button onClick={onBuyTicket} className="btn btn-primary">
      Buy Now
    </button>
  );
};

export default CardButton;
