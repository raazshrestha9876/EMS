import jwt from "jsonwebtoken";
import { Mongoose } from "mongoose";

export const generateToken = (userId: string) => {
  const token = jwt.sign(
    { id: userId.toString() },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
  return token;
};
