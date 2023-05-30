import * as express from "express";
import { privateRoute } from "@sh-tickets/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  privateRoute,
  (req: express.Request, res: express.Response) => {
    res.status(200).json({
      message: "fetched current user info successfully",
      data: req.user,
      error: false,
    });
  }
);

export { router as currentUserRouter };
