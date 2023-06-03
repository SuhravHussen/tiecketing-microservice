import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";

it("must return error if not signed in", async () => {
  await request(app)
    .put("/api/tickets/update/5f9d7b3b2e3b3b2e3b3b2e3b")
    .send({})
    .expect(401);
});

it("must return error if user ticket not found", async () => {
  await request(app)
    .put("/api/tickets/update/5f9d7b3b2e3b3b2e3b3b2e3b")
    .set("Cookie", mockSignIn(true))
    .expect(404);
});

it("must return error if user is not the owner of the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", mockSignIn(true))
    .send({
      title: "test",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/update/${res.body.data._id}`)
    .set("Cookie", mockSignIn(true, true))
    .expect(401);
});

it("must return updated ticket if user is the owner of the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", mockSignIn(true))
    .send({
      title: "test",
      price: 10,
    });

  const res2 = await request(app)
    .put(`/api/tickets/update/${res.body.data.id}`)
    .set("Cookie", mockSignIn(true))
    .send({
      title: "test2",
      price: 20,
    })
    .expect(200);

  expect(res2.body.data.title).toEqual("test2");
  expect(res2.body.data.price).toEqual(20);
});
