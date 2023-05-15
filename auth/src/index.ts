import express from "express";

import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user.route";
import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { signupRouter } from "./routes/signup.route";
import errorHandler from "./middlewares/errorHandler.middleware";
import { HttpException } from "./exceptions/HttpException";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
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

//mongodb
const start = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new HttpException(500, "JWT_SECRET must be defined");
    }

    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "Internal Server Error");
  }
};

start();

//listen to port
app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});
