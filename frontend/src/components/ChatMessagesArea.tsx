import { useChatStore } from "../store";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";

export function ChatMessagesArea() {
  const { conversations, currentConversation } = useChatStore((state) => state);
  const conversation = currentConversation
    ? conversations[currentConversation] ?? null
    : null;

  return (
    <main className="flex-1 flex flex-col bg-background-light">
      <ChatHeader />
      {/* Chat Messages */}
      {conversation ? (
        <ChatMessages />
      ) : (
        <main className="flex-1 flex flex-col  items-center justify-center">
          <div className="text-highlight text-5xl">Welcome!</div>
        </main>
      )}
      {/* Chat Footer */}
      <ChatFooter />
    </main>
  );
}
