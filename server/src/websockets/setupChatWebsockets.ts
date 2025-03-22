import http from "http";
import { Server } from "socket.io";
import jwt, { Secret } from "jsonwebtoken";
import { db } from "db/dbSetup";
import { SUCCESS_MESSAGE } from "utils/responseHandling";
import {
  ClientToServerEvents,
  DatabaseChatMessage,
  ServerToClientEvents,
} from "./types";
import { MAX_FIELD_LENGTH } from "middleware/validation";

// For the place details page chat widget
export const setupChatWebsockets = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const websocket = new Server<ClientToServerEvents, ServerToClientEvents>(
    server,
    {
      connectionStateRecovery: {
        maxDisconnectionDuration: 300000, // 5 minutes
        skipMiddlewares: true,
      },
    }
  );

  websocket
    .use((socket, next) => {
      const token = socket.handshake.query.token;

      if (token) {
        jwt.verify(
          token as string,
          process.env.ACCESS_TOKEN_SECRET as Secret,
          (error, userToken) => {
            if (error) {
              console.error(error);
              return next(new Error("Access token is invalid"));
            }

            // https://stackoverflow.com/questions/68266126/how-fix-property-usernam-does-not-exist-on-type-socketdefaulteventsmap-defa
            (socket as any).userToken = userToken;
            next();
          }
        );
      } else {
        next(new Error("No access token was provided"));
      }
    })
    .on("connection", (socket) => {
      // Join a place details page room
      // The room is the placeId
      socket.on("joinRoom", (room) => {
        socket.join(room);
      });

      // Broadcast each person's message to everyone in the room
      socket.on("message", async ({ room, message }) => {
        const { id, status, contentType, senderId, content, createdTime } =
          message;

        const trimmedContent = content.trim();

        // TODO: Need to do more incoming data validation than just this?
        if (trimmedContent.length > MAX_FIELD_LENGTH) {
          websocket.to(room).emit("message", { status: "Message too long" });
          return;
        }

        try {
          // Store the message in the DB
          await db.query<DatabaseChatMessage>(
            `INSERT INTO chat_logs (chat_id, place_id, chat_status, content_type, sender_id, content, created_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              id,
              room,
              status,
              contentType,
              senderId,
              trimmedContent,
              new Date(createdTime),
            ]
          );

          websocket
            .to(room)
            .emit("message", { status: SUCCESS_MESSAGE, message });
        } catch (error) {
          console.error(error);
          websocket.to(room).emit("message", { status: "Websocket error" });
        }
      });
    });
};
