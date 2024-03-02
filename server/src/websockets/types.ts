export enum DBChatMessageDirection {
  Incoming = 1,
  Outgoing = 2,
}

export enum ChatMessageDirection {
  Incoming = "incoming",
  Outgoing = "outgoing",
}

export interface DatabaseChatMessage {
  chat_id: string;
  place_id: string;
  chat_status: number;
  content_type: number;
  sender_id: string;
  direction: DBChatMessageDirection; // 1 is incoming, 2 is outgoing
  content: string;
  created_time: Date;
}

interface ChatscopeMessage {
  id: string;
  status: number;
  contentType: number;
  senderId: string;
  direction: ChatMessageDirection;
  content: string;
  createdTime: string;
}

export interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  message: ({
    room,
    message,
  }: {
    room: string;
    message: ChatscopeMessage;
  }) => void;
}

export interface ServerToClientEvents {
  message: ({
    status,
    message,
  }: {
    status: string;
    message?: ChatscopeMessage;
  }) => void;
}
