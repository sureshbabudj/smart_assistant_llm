import type { Conversation } from "../types";

export function getMockConversations(
  conversationCount: number = 10,
  messageCount: number = 10
): Conversation[] {
  // Helper to get a random date within the last 3 years
  function getRandomDateWithin3Years() {
    const now = Date.now();
    const threeYearsAgo = now - 3 * 365 * 24 * 60 * 60 * 1000;
    return new Date(threeYearsAgo + Math.random() * (now - threeYearsAgo));
  }

  // Helper to get a random date after a given date and before now
  function getRandomDateAfter(date: Date) {
    const start = date.getTime();
    const end = Date.now();
    return new Date(start + Math.random() * (end - start));
  }

  // Helper to generate random message content between 4 words and 25 lines
  function getRandomMessageContent() {
    const lines = Math.floor(Math.random() * 25) + 1;
    let content = "";
    for (let i = 0; i < lines; i++) {
      const words = Math.floor(Math.random() * 16) + 4; // 4 to 20 words per line
      const line = Array.from({ length: words }, () =>
        Math.random().toString(36).substring(2, 8)
      ).join(" ");
      content += line + (i < lines - 1 ? "\n" : "");
    }
    return content;
  }

  return Array.from({ length: conversationCount }, (_, i) => {
    const createdAt = getRandomDateWithin3Years();
    let lastMsgDate = createdAt;
    const messages = Array.from({ length: messageCount }, (_, j) => {
      // Each message timestamp is after or equal to conversation createdAt
      const msgDate = getRandomDateAfter(lastMsgDate);
      lastMsgDate = msgDate;
      return {
        id: `msg-${i + 1}-${j + 1}`,
        content: getRandomMessageContent(),
        role: j % 2 === 0 ? "user" : "assistant",
        sender: (j % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
        createdAt: msgDate.toISOString(),
        timestamp: msgDate.toISOString(),
      };
    });
    // updatedAt should not be older than createdAt, and not before last message
    const updatedAt = lastMsgDate > createdAt ? lastMsgDate : createdAt;
    return {
      id: `conv-${i + 1}`,
      title: `Conversation ${i + 1}`,
      messages,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  });
}
