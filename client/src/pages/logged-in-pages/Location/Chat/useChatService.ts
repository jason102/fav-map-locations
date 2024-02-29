import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "src/app/store";
import {
  IStorage,
  UpdateState,
  BasicStorage,
  ChatMessage,
  MessageContentType,
  Conversation,
  Participant,
  ConversationRole,
} from "@chatscope/use-chat";

import { UserToken } from "src/app/api/auth/types";
import { ChatService } from "./ChatService";

// See the example project for how to use the @chatscope libs:
// https://github.com/chatscope/use-chat-example
export const useChatService = () => {
  const { placeId } = useParams();

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { username } = useAppSelector(
    (state) => state.auth.userToken
  ) as UserToken;

  // React.StrictMode rerenders the app twice in dev mode
  const firstRender = useRef(true);

  const messageIdGenerator = (message: ChatMessage<MessageContentType>) => {
    return `m_${placeId}${message.senderId}${Date.now()}`;
  };
  const groupIdGenerator = () => {
    return `g_${placeId}`;
  };

  const storage = useRef<BasicStorage>(
    new BasicStorage({
      groupIdGenerator,
      messageIdGenerator,
    })
  );
  const chatService = useRef<ChatService | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      const conversation = new Conversation({
        id: `c_${placeId}`,
        participants: [
          new Participant({
            id: username,
            role: new ConversationRole([]),
          }),
        ],
        draft: "",
      });

      storage.current.addConversation(conversation);
      storage.current.setActiveConversation(`c_${placeId}`);

      setShowChat(true);
    }

    return () => {
      if (chatService.current?.socket && chatService.current.socket.connected) {
        chatService.current.socket.disconnect();
      }
    };
  }, [placeId, username]);

  const chatServiceFactory = (storage: IStorage, updateState: UpdateState) => {
    if (!chatService.current) {
      chatService.current = new ChatService(
        storage,
        updateState,
        accessToken,
        username,
        placeId ?? ""
      );
    }

    return chatService.current;
  };

  return { showChat, chatStorage: storage.current, chatServiceFactory };
};
