import * as express from "express";

const router = express.Router();

router.post(
  "/api/users/signout",
  (req: express.Request, res: express.Response) => {
    req.session = null;
    res.status(200).json({
      message: "logged out successfully",
      data: null,
      error: false,
    });
  }
);

export { router as signoutRouter };
