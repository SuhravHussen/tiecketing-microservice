import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";

it("must be signed in to find a ticket", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("must return an error if the ticket is not found", async () => {
  request(app)
    .get(`/api/tickets/647abea0ed015d62155716b8`)
    .set("Cookie", mockSignIn(true))
    .send({})
    .expect(404);
});

it("must return a error id id is invalid", async () => {
  request(app)
    .get(`/api/tickets/sdsdsd`)
    .set("Cookie", mockSignIn(true))
    .send({})
    .expect(500);
});

it("must return a ticket if the ticket is found", async () => {
  const cookie = mockSignIn(true);

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 10,
    })
    .expect(201);

  const res2 = await request(app)
    .get(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(res2.body.data.title).toEqual("test");
  expect(res2.body.data.price).toEqual(10);
  expect(res2.body.data.id).toEqual(res.body.data.id);
});
