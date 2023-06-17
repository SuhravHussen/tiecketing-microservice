import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";
import { ticketModel } from "../models/ticket.model";
import { OrderModel } from "../models/order.model";
import { orderStatus } from "@sh-tickets/common";

it("if user is not signed in, it returns 401", async () => {
  await request(app).get("/api/orders/all").send({}).expect(401);
});

it("return 404 if no orders found", async () => {
  const cookie = mockSignIn(true);

  await request(app)
    .get("/api/orders/all")
    .set("Cookie", cookie)
    .send({})
    .expect(404);
});

it("returns orders if found", async () => {
  const ticket = ticketModel.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookie = mockSignIn(true);

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const res = await request(app)
    .get("/api/orders/all")
    .set("Cookie", cookie)
    .send({});

  expect(res.body.data[0].ticket.id).toEqual(ticket.id);
});
