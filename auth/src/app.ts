import express from "express";

import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user.route";
import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { signupRouter } from "./routes/signup.route";
import { HttpException, errorHandler } from "@sh-tickets/common";

import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
  })
);

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// 404 handler
app.all("*", (req, res, next) => {
  throw new HttpException(404, "Route Not Found");
});

//error handler
app.use(errorHandler);

export default app;
