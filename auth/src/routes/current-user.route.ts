import * as express from "express";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  (req: express.Request, res: express.Response) => {
    res.send("Hi there!");
  }
);

export { router as currentUserRouter };
