import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { getSignedJwtTokens } from "utils/jwt";

const router = express.Router();

router.get("/refreshToken", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: "Login required" });
    }

    // Check if the existing refreshToken has expired or is invalid
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      (error, userToken) => {
        if (error) {
          return res.status(403).json({ error: error.message });
        }

        // The existing refreshToken is still valid, so let's get
        // a new accessToken and refreshToken - Remove the old iat
        // and exp values in userToken so we can resign the same
        // information and get updated iat and exp timestamps
        const userInfoToSign = {
          userId: userToken.userId,
          username: userToken.username,
          email: userToken.email,
        };

        const { refreshToken, accessToken } =
          getSignedJwtTokens(userInfoToSign);

        // Set the updated refreshToken cookie and return the updated
        // accessToken to the frontend
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

export default router;
