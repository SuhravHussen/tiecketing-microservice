import * as express from "express";

import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user.route";
import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { signupRouter } from "./routes/signup.route";
import errorHandler from "./middlewares/errorHandler.middleware";
import { HttpException } from "./exceptions/HttpException";

const app = express();
app.use(json());
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

//listen to port
app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});
