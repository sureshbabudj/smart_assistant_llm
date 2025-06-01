import { useEffect, useRef } from "react";
import { useChatStore } from "../store";
import { ChatMessage } from "./ChatMessage";
import { debounce } from "../utils/debounce";
import { useSSE } from "../hook/useSse";
import { useStreamingMessages } from "../hook/useStreamingMessages";

export function ChatMessages() {
  const { currentConversation, messages } = useChatStore();
  const { eventSourceRef } = useSSE(`/api/chat/stream`, currentConversation);
  const { token } = useStreamingMessages(eventSourceRef);
  const scrollToBottom = useRef<HTMLDivElement>(null);

  const scrollToBottomEvent = () => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scrollDebounced = debounce(scrollToBottomEvent, 1000);
    scrollDebounced();
  }, [token]);

  useEffect(() => {
    scrollToBottomEvent();
  }, [messages, currentConversation]);

  const handleRewind = () => {
    if (messages.length > 1) {
      const lastAssistantMessage = messages[messages.length - 1];
      const lastUserMessage = messages[messages.length - 2];
      if (
        lastUserMessage.sender === "user" &&
        lastAssistantMessage.sender === "assistant"
      ) {
        useChatStore.getState().messages = messages.slice(0, -2);
        // handlemessages(lastUserMessage.content);
      }
    }
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg, idx) => (
        <ChatMessage
          message={msg}
          key={msg.id}
          isLast={idx === messages.length - 1}
          rewind={handleRewind}
        />
      ))}
      {token && (
        <ChatMessage
          message={{
            id: "streaming",
            content: token,
            sender: "assistant",
            timestamp: new Date(),
            isLoading: true,
            isError: false,
            isSuccess: false,
            isCompleted: false,
            error: null,
            conversationId: new Date().toISOString(),
          }}
          isLast={true}
          rewind={handleRewind}
        />
      )}
      <div id="scroll-to-bottom" ref={scrollToBottom} />
    </div>
  );
}
