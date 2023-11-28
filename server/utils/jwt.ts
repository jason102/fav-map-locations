import jwt from "jsonwebtoken";
import { PublicUserInfo } from "../types";

// Generate an access token and a refresh token for this database user
// Copied from https://github.com/morganpage/jwt-pg/blob/main/utils/jwt-helpers.js
const getSignedJwtTokens = (user: PublicUserInfo) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ?? "", {
    expiresIn: "20s",
  });

  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET ?? "", {
    expiresIn: "5m",
  });

  return { accessToken, refreshToken };
};

export { getSignedJwtTokens };
