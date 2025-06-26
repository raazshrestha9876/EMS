import { Response } from "express";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "none",
    secure: true,
  });
};

export default setAuthCookie;
