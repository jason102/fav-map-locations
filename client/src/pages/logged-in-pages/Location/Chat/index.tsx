import React from "react";
import { useAppSelector } from "src/app/store";
import {
  useChat,
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  MessageContent,
  TextContent,
} from "@chatscope/use-chat";
import {
  MainContainer,
  ChatContainer,
  MessageGroup,
  Message,
  MessageList,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import { UserToken } from "src/app/api/auth/types";

const Chat: React.FC = () => {
  const {
    currentMessages,
    activeConversation,
    sendMessage,
    currentMessage,
    setCurrentMessage,
  } = useChat();

  const { username } = useAppSelector(
    (state) => state.auth.userToken
  ) as UserToken;

  const handleSend = (text: string) => {
    const message = new ChatMessage({
      id: "", // Id is generated by messageIdGenerator()
      content: text as unknown as MessageContent<TextContent>,
      contentType: MessageContentType.TextHtml,
      senderId: username,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent,
    });

    sendMessage({
      message,
      conversationId: activeConversation!.id,
      senderId: username,
    });
  };

  return (
    <MainContainer responsive>
      <ChatContainer>
        <MessageList
          style={{ height: "500px", overflowY: "auto" }}
          autoScrollToBottom
        >
          {currentMessages.map(({ direction, messages }, index) => (
            <MessageGroup key={index} direction={direction}>
              <MessageGroup.Messages>
                {messages.map(
                  ({
                    id,
                    senderId,
                    content,
                    direction,
                    createdTime,
                  }: ChatMessage<MessageContentType>) => (
                    <div key={id}>
                      <Message.Header
                        sender={senderId === username ? "Me" : username}
                        sentTime={new Date(createdTime).toLocaleString([], {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      />
                      <Message
                        model={{
                          type: "html",
                          payload: content,
                          direction,
                          position: "normal",
                        }}
                      />
                    </div>
                  )
                )}
              </MessageGroup.Messages>
            </MessageGroup>
          ))}
        </MessageList>
        <MessageInput
          value={currentMessage}
          onChange={setCurrentMessage}
          onSend={handleSend}
          disabled={!activeConversation}
          attachButton={false}
          placeholder="Type a comment here..."
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default Chat;
