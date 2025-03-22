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
  MessageDirection,
} from "@chatscope/use-chat";

import { UserToken } from "src/app/api/auth/types";
import { ChatService } from "./ChatService";

const LOAD_MESSAGES_LIMIT = 50;

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
    const initializeStorage = async () => {
      if (firstRender.current) {
        firstRender.current = false;

        const conversationId = `c_${placeId}`;

        const conversation = new Conversation({
          id: conversationId,
          participants: [
            new Participant({
              id: username,
              role: new ConversationRole([]),
            }),
          ],
          draft: "",
        });

        storage.current.addConversation(conversation);
        storage.current.setActiveConversation(conversationId);

        try {
          // TODO: Later pagination on the frontend side should be enabled for loading earlier and earlier messages
          // when the user scrolls all the way up in the chat widget
          const response = await fetch(
            `${
              import.meta.env.VITE_BASE_URL
            }/api/chatMessages?placeId=${placeId}&limit=${LOAD_MESSAGES_LIMIT}&offset=0`,
            {
              credentials: "include",
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const {
            data: downloadedMessages,
          }: { data: Omit<ChatMessage<MessageContentType>, "direction">[] } =
            await response.json();

          downloadedMessages.forEach((message) => {
            storage.current.addMessage(
              {
                ...message,
                direction:
                  username === message.senderId
                    ? MessageDirection.Outgoing
                    : MessageDirection.Incoming,
              },
              conversationId
            );
          });
        } catch (error) {
          // TODO: show snackbar
          console.error(error);
        }

        setShowChat(true);
      }
    };

    initializeStorage();

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
