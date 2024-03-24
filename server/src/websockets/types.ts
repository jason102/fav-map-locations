export interface DatabaseChatMessage {
  chat_id: string;
  place_id: string;
  chat_status: number;
  content_type: number;
  sender_id: string;
  content: string;
  created_time: Date;
}

export interface ChatscopeMessage {
  id: string;
  status: number;
  contentType: number;
  senderId: string;
  content: string;
  createdTime: Date;
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
