import http from "http";
import { Server } from "socket.io";
import jwt, { Secret } from "jsonwebtoken";

// For the place details page chat widget
export const setupChatWebsockets = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server);

  io.use((socket, next) => {
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
  }).on("connection", (socket) => {
    // Join a place details page room
    // The room is the placeId
    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    // Broadcast each person's message to everyone in the room
    socket.on("message", (data) => {
      const { room, message } = data;
      io.to(room).emit("message", message);
    });
  });
};
