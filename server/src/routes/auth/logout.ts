import express, { NextFunction, Request, Response } from "express";
import { SUCCESS_MESSAGE, respondWith } from "utils/responseHandling";

const router = express.Router();

router.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refresh_token");

      respondWith({ res, status: 200, data: SUCCESS_MESSAGE });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
