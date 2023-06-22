import ticketModel from "../ticket.model";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket

  const ticket = ticketModel.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await ticketModel.findById(ticket.id);
  const secondInstance = await ticketModel.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance?.save();

  // save the second fetched ticket and expect an error
  //because we have already updated the version after doing the first save
  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});
