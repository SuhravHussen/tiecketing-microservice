import * as express from "express";
import jwt from "jsonwebtoken";
import { validateEmailAndPassword, HttpException } from "@sh-tickets/common";
import userModel from "../models/user.model";

const router = express.Router();

router.post(
  "/api/users/signup",
  validateEmailAndPassword,
  async (req: express.Request, res: express.Response, next) => {
    try {
      const { email, password } = req.body;

      //check if user already exists
      const alreadyExist = await userModel.findOne({ email });

      if (alreadyExist) {
        return res.status(400).json({
          message: "User already exists",
          error: true,
          data: null,
        });
      }

      //create new user
      const user = userModel.build({ email, password });
      await user.save();

      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // Expire in 3 days
        },
        process.env.JWT_SECRET! // ! tells typescript that we have already checked for undefined
      );

      // Store it on session object
      req.session = {
        jwt: userJwt,
      };

      res.status(201).send({
        message: "User created successfully",
        data: user,
        error: false,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRouter };
