import jwt from "jsonwebtoken";
import * as express from "express";
import { validateEmailAndPassword, HttpException } from "@sh-tickets/common";
import userModel from "../models/user.model";

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
        const userJwt = jwt.sign(
          {
            id: user.id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // Expire in 3 days // 1 hour
          },
          process.env.JWT_SECRET! // ! tells typescript that we have already checked for undefined
        );

        // Store it on session object
        req.session = {
          jwt: userJwt,
        };

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
