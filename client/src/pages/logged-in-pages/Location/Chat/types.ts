import {
  ChatEvent,
  ChatEventHandler,
  ChatEventType,
  ChatMessage,
  MessageContentType,
} from "@chatscope/use-chat";

export interface ClientToServerEvents {
  joinRoom: (placeId: string) => void;
  message: ({
    room,
    message,
  }: {
    room: string;
    message: Omit<ChatMessage<MessageContentType>, "direction">;
  }) => void;
}

export interface ServerToClientEvents {
  message: ({
    status,
    message,
  }: {
    status: string;
    message?: Omit<ChatMessage<MessageContentType>, "direction">;
  }) => void;
  error: (error: Error) => void;
}

// https://github.com/chatscope/use-chat/blob/main/src/examples/ExampleChatService.ts
export type EventHandlers = {
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
