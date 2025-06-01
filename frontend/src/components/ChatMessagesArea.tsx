import { useChatStore } from "../store";
import { cn } from "../utils/classnames";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";

export function ChatMessagesArea({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { conversations, currentConversation } = useChatStore((state) => state);
  const conversation = currentConversation
    ? conversations.find(({ id }) => id === currentConversation) ?? null
    : null;

  return (
    <main
      className={cn("flex-1 flex flex-col bg-background-light", className)}
      {...props}
    >
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
