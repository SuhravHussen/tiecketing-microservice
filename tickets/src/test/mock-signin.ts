import Jwt from "jsonwebtoken";
const mockSignIn = (valid: boolean) => {
  if (!valid) {
    const sessionObj = { jwt: "sdhsdbhsdbvhsdbvshdbhsbd" };

    const sessionJSON = JSON.stringify(sessionObj);

    const base64 = Buffer.from(sessionJSON).toString("base64");

    return [`session=${base64}`];
  }
  const payload = {
    id: "1234",
    email: "tes@test.com",
  };

  const token = Jwt.sign(payload, process.env.JWT_SECRET!);

  const sessionObj = { jwt: token };

  const sessionJSON = JSON.stringify(sessionObj);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

export default mockSignIn;
