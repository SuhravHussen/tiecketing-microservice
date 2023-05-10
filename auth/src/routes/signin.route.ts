import * as express from "express";
import validateEmailAndPassword from "../middlewares/validation.middleware";
import userModel from "../models/user.model";
import { HttpException } from "../exceptions/HttpException";

const router = express.Router();

router.post(
  "/api/users/signin",
  validateEmailAndPassword,
  async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;

      //find user
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
          error: true,
          data: null,
        });
      }

      const isValidPassword = await user.comparePassword(password);

      if (isValidPassword) {
        return res.status(200).json({
          message: "User logged in successfully",
          error: false,
          data: user,
        });
      } else {
        return res.status(400).json({
          message: "Invalid credentials",
          error: true,
          data: null,
        });
      }
    } catch (err) {
      throw new HttpException(500, err.message || "Internal Server Error");
    }
  }
);

export { router as signinRouter };
