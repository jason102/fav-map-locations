import {
  IChatService,
  SendMessageServiceParams,
  IStorage,
  UpdateState,
  ChatEventType,
  ChatEventHandler,
  ChatEvent,
  MessageEvent,
  ChatMessage,
  MessageContentType,
  MessageDirection,
} from "@chatscope/use-chat";
import { Manager, Socket } from "socket.io-client";
import { PlaceId } from "src/pages/logged-in-pages/Location/types";

// Most of this file is set up according to the @chatscope/use-chat example files:
// https://github.com/chatscope/use-chat/blob/main/src/examples/ExampleChatService.ts
type EventHandlers = {
  onMessage: ChatEventHandler<
    ChatEventType.Message,
    ChatEvent<ChatEventType.Message>
  >;
  onConnectionStateChanged: ChatEventHandler<
    ChatEventType.ConnectionStateChanged,
    ChatEvent<ChatEventType.ConnectionStateChanged>
  >;
  onUserConnected: ChatEventHandler<
    ChatEventType.UserConnected,
    ChatEvent<ChatEventType.UserConnected>
  >;
  onUserDisconnected: ChatEventHandler<
    ChatEventType.UserDisconnected,
    ChatEvent<ChatEventType.UserDisconnected>
  >;
  onUserPresenceChanged: ChatEventHandler<
    ChatEventType.UserPresenceChanged,
    ChatEvent<ChatEventType.UserPresenceChanged>
  >;
  onUserTyping: ChatEventHandler<
    ChatEventType.UserTyping,
    ChatEvent<ChatEventType.UserTyping>
  >;
  [key: string]: any;
};

export class ChatService implements IChatService {
  storage: IStorage;
  updateState: UpdateState;
  socket: Socket;
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

    const manager = new Manager("http://localhost:8080/", {
      query: { token: accessToken },
      transports: ["websocket"],
    });

    this.socket = manager.socket("/");

    this.socket.on("connect", () => {
      this.socket.emit("joinRoom", this.placeId);
    });

    this.socket.on("message", (message: ChatMessage<MessageContentType>) => {
      // Replace "Outgoing" with "Incoming" so the Chat UI lib can differentiate between the two types of messages
      message.direction = MessageDirection.Incoming;

      // Don't show the current user's own message twice (message.senderId !== this.currentUsername)
      if (
        this.eventHandlers.onMessage &&
        message.senderId !== this.currentUsername
      ) {
        this.eventHandlers.onMessage(
          new MessageEvent({ message, conversationId: `c_${this.placeId}` })
        );
      }
    });

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

    this.socket.emit("message", { room: placeId, message });
  }

  // Not implemented
  sendTyping() {}
}
