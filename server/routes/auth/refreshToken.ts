import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { getSignedJwtTokens } from "../../utils/jwt";

const router = express.Router();

router.get("/refreshToken", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      (error, userInfoToSign) => {
        if (error) {
          return res.status(403).json({ error: error.message });
        }
        const { refreshToken, accessToken } =
          getSignedJwtTokens(userInfoToSign);

        res.cookie("refresh_token", refreshToken, {
          ...(process.env.COOKIE_DOMAIN && {
            domain: process.env.COOKIE_DOMAIN,
          }),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        return res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});
