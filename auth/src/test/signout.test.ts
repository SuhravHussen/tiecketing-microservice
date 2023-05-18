import request from "supertest";
import app from "../app";

it("return error if user is not authenticated", async () => {
  await request(app).get("/api/users/signout").send().expect(401);
});

it("clears the cookie after signing out", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const cookie = res.get("Set-Cookie");
  const response = await request(app)
    .get("/api/users/signout")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
