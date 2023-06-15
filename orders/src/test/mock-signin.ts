import Jwt from "jsonwebtoken";
import mongoose from "mongoose";

const mockSignIn = (valid: boolean, randomId = false) => {
  if (!valid) {
    const sessionObj = { jwt: "sdhsdbhsdbvhsdbvshdbhsbd" };

    const sessionJSON = JSON.stringify(sessionObj);

    const base64 = Buffer.from(sessionJSON).toString("base64");

    return [`session=${base64}`];
  }
  const payload = {
    id: randomId
      ? new mongoose.Types.ObjectId().toHexString()
      : "5f9d7b3b2e3b3b2e3b3b2e3b",
    email: "tes@test.com",
  };

  const token = Jwt.sign(payload, process.env.JWT_SECRET!);

  const sessionObj = { jwt: token };

  const sessionJSON = JSON.stringify(sessionObj);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

export default mockSignIn;
