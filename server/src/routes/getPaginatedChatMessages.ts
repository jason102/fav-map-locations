import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { db } from "db/dbSetup";
import { verifyToken } from "middleware/verifyToken";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";
import { PlaceId } from "routes/places/types";
import { DatabaseChatMessage, ChatscopeMessage } from "websockets/types";

const MAX_LIMIT = 100;

const router = express.Router();

interface QueryParams {
  placeId: PlaceId;
  limit: number;
  offset: number;
}

router.get(
  "/",
  verifyToken,
  queryHas("placeId", { isNumber: true }),
  queryHas("limit", { isNumber: true }),
  queryHas("offset", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { placeId, limit, offset } = matchedData(req) as QueryParams;

    if (limit > MAX_LIMIT) {
      return respondWith({
        res,
        status: 422,
        errorMessage: "Number of messages requested is too many",
      });
    }

    try {
      const { rows: dbChatMessages } = await db.query<DatabaseChatMessage>(
        `SELECT * FROM chat_logs
        WHERE place_id = $1
        ORDER BY created_time ASC
        LIMIT $2 OFFSET $3`,
        [placeId, limit, offset]
      );

      const messages = dbChatMessages.map<ChatscopeMessage>((dbMsg) => ({
        id: dbMsg.chat_id,
        status: dbMsg.chat_status,
        contentType: dbMsg.content_type,
        senderId: dbMsg.sender_id,
        content: dbMsg.content,
        createdTime: dbMsg.created_time,
      }));

      respondWith({ res, status: 200, data: messages });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
