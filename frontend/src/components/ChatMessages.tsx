import { useEffect, useRef } from "react";
import { useChatStore } from "../store";
import { ChatMessage } from "./ChatMessage";
import { debounce } from "../utils/debounce";
import { useChatEngine } from "../hook/useChatEngine";

export function ChatMessages() {
  const { inputs, output, currentConversation } = useChatStore();
  const { handleInput } = useChatEngine();
  const scrollToBottom = useRef<HTMLDivElement>(null);

  const displayMessages = [...inputs];
  output.content && displayMessages.push(output as any);

  const scrollToBottomEvent = () => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scrollDebounced = debounce(scrollToBottomEvent, 1000);
    scrollDebounced();
  }, [output]);

  useEffect(() => {
    scrollToBottomEvent();
  }, [currentConversation]);

  const handleRewind = () => {
    if (inputs.length > 1) {
      const lastAssistantMessage = inputs[inputs.length - 1];
      const lastUserMessage = inputs[inputs.length - 2];
      if (
        lastUserMessage.sender === "user" &&
        lastAssistantMessage.sender === "assistant"
      ) {
        useChatStore.getState().inputs = inputs.slice(0, -2);
        handleInput(lastUserMessage.content);
      }
    }
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {displayMessages.map((msg, idx) => (
        <ChatMessage
          message={msg}
          key={msg.id}
          isLast={idx === inputs.length - 1}
          rewind={handleRewind}
        />
      ))}
      <div id="scroll-to-bottom" ref={scrollToBottom} />
    </div>
  );
}
