import type { Conversation, Message } from "../types";

export function createMessage({
  sender,
  content,
  ...rest
}: Partial<Message> & {
  sender: Message["sender"];
  content: Message["content"];
}): Message {
  return {
    id: sender + "-conv-" + Date.now(),
    timestamp: new Date().toISOString(),
    sender,
    content,
    error: "",
    isLoading: false,
    isError: false,
    isSuccess: false,
    isCompleted: false,
    ...rest,
  };
}

export function createConversation({
  messages,
  ...rest
}: Partial<Conversation> & { messages: Message[] }): Conversation {
  // Generate a unique conversation title with numbering based on timestamp
  const uniqueNumber = Date.now();
  // Keep only the first 3 or fewer words from the first message's content for the title
  const getTitle = (msg?: Message) => {
    if (!msg || !msg.content) return `Conversation ${uniqueNumber}`;
    return msg.content.split(/\s+/).slice(0, 3).join(" ");
  };

  return {
    id: "conv-" + uniqueNumber,
    title: getTitle(messages[0]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFlagged: false,
    messages,
    ...rest,
  };
}
