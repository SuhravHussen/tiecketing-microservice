import * as express from "express";
import validateEmailAndPassword from "../middlewares/validation.middleware";

const router = express.Router();

router.post(
  "/api/users/signup",
  validateEmailAndPassword,
  (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    res.send({ email, password });
  }
);

export { router as signupRouter };
