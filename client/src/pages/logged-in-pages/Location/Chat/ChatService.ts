import {
  IChatService,
  SendMessageServiceParams,
  IStorage,
  UpdateState,
  ChatEventType,
  ChatEventHandler,
  ChatEvent,
  MessageEvent,
  MessageDirection,
  ChatMessage,
  MessageContentType,
} from "@chatscope/use-chat";
import { Manager, Socket } from "socket.io-client";
import { PlaceId } from "src/pages/logged-in-pages/Location/types";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  EventHandlers,
} from "./types";

// Most of this file is set up according to the @chatscope/use-chat example files:
// https://github.com/chatscope/use-chat/blob/main/src/examples/ExampleChatService.ts
export class ChatService implements IChatService {
  storage: IStorage;
  updateState: UpdateState;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  currentUsername: string;
  placeId: PlaceId;

  eventHandlers: EventHandlers = {
    onMessage: () => {},
    onConnectionStateChanged: () => {},
    onUserConnected: () => {},
    onUserDisconnected: () => {},
    onUserPresenceChanged: () => {},
    onUserTyping: () => {},
  };

  constructor(
    storage: IStorage,
    updateState: UpdateState,
    accessToken: string,
    username: string,
    placeId: PlaceId
  ) {
    this.storage = storage;
    this.updateState = updateState;
    this.currentUsername = username;
    this.placeId = placeId;

    const manager = new Manager(import.meta.env.VITE_BASE_URL, {
      query: { token: accessToken },
      transports: ["websocket"],
    });

    this.socket = manager.socket("/");

    this.socket.on("connect", () => {
      this.socket.emit("joinRoom", this.placeId);
    });

    this.socket.on("message", ({ status, message }) => {
      if (status === "success" && message) {
        const incomingMessage: ChatMessage<MessageContentType> = {
          ...message,
          direction: MessageDirection.Incoming,
        };

        // Don't show the current user's own message twice (message.senderId !== this.currentUsername)
        if (
          this.eventHandlers.onMessage &&
          incomingMessage.senderId !== this.currentUsername
        ) {
          this.eventHandlers.onMessage(
            new MessageEvent({
              message: incomingMessage,
              conversationId: `c_${this.placeId}`,
            })
          );
        }
      } else {
        // TODO: Show FetchResultSnackbar error so user also has some feedback
        console.error(status);
      }
    });

    // TODO: Show user the connection was lost and maybe even a way for them to manually trigger reconnecting?
    this.socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
    });

    this.socket.on("error", (error) => {
      console.log("Error:", error);
    });
  }

  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

    if (key in this.eventHandlers) {
      this.eventHandlers[key] = evtHandler;
    }
  }

  off<T extends ChatEventType>(evtType: T) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = () => {};
    }
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    // Remove the 'c_' at the beginning
    const placeId = conversationId.substring(2);

    // The direction is not necessary to save as 1) all the chat messages are stored together
    // and there's no such concept as a "current user" in the database table, and
    // 2) this field is added in when the messages come in on the on message event.
    // Also see how it's done in client/src/pages/logged-in-pages/Location/Chat/useChatService.ts
    const messageWithoutDirection = {
      ...message,
      direction: undefined,
    };

    this.socket.emit("message", {
      room: placeId,
      message: messageWithoutDirection,
    });
  }

  // Not implemented
  sendTyping() {}
}
