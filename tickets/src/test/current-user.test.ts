import request from "supertest";
import app from "../app";

it("returns error if user is not authenticated", async () => {
  await request(app).get("/api/users/currentuser").send().expect(401);
});

it("returns current user info if user is authenticated", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  const currentUserResponse = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(currentUserResponse.body.data.email).toEqual("test@gmail.com");
});
