import * as express from "express";

const router = express.Router();

router.post(
  "/api/users/signin",
  (req: express.Request, res: express.Response) => {
    res.send("Hi there signin!");
  }
);

export { router as signinRouter };
