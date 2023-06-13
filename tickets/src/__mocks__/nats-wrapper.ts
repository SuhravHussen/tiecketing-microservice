// the create ticket and update ticket route calling the ticketCreatedPublisher() and ticketUpdatedPublisher() method
//and we are passing client into them. But during test we are passing fake client like this:
// const natsWrapper = {
//   client: {
//     publish: (subject, data, callback) => {
//       callback();
//     },
//   },
// };

// const ticketCreatedPublisher = new TicketCreatedPublisher(natsWrapper.client);

// ticketCreatedPublisher.publish(data);
//this publish method is inner method of ticketCreatedPublisher class which getting extended from Base publisher and then this publisher will call our publisher inside of it because this publisher calling this.client.publish() inside of it.

// the fake client has a publish method which will do nothing but call the callback function.

export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject, data, callback) => {
      callback();
    }),
  },
};
