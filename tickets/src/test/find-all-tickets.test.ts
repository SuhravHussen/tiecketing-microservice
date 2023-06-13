import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";
jest.mock("../nats-wrapper");

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", mockSignIn(true))
    .send({
      title: "test",
      price: 10,
    });
};

it("must return error if no  tickets", async () => {
  await request(app).get("/api/tickets/all").send({}).expect(404);
});

it("must return all tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get("/api/tickets/all").send({}).expect(200);

  expect(res.body.data.length).toEqual(3);
});
