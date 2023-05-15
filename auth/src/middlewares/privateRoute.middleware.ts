import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const privateRoute = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.jwt) {
    throw new HttpException(401, "Not Authorized");
  }

  const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);

  req.user = payload as { email: string; id: string };

  next();
};

export default privateRoute;
