import express from "express";

import { json } from "body-parser";

import { HttpException, errorHandler } from "@sh-tickets/common";
import cookieSession from "cookie-session";

import { createOrdersRoute } from "./routes/create.route";
import { findOrdersRoute } from "./routes/find.route";
import { deleteOrdersRoute } from "./routes/delete.route";

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
app.use(createOrdersRoute);
app.use(findOrdersRoute);
app.use(deleteOrdersRoute);

// 404 handler
app.all("*", (req, res, next) => {
  throw new HttpException(404, "Route Not Found");
});

//error handler
app.use(errorHandler);

export default app;
