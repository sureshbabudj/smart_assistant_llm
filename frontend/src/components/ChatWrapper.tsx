import { SlideOverMenu } from "./SlideOverMenu";
import { LeftSidebar } from "./LeftSidebar";
import { ChatList } from "./ChatList";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { Sidebar } from "./Sidebar";
import { useEffect } from "react";
import { useChatStore } from "../store";

export function ChatWrapper() {
  const { fetchConversations, currentConversation, setMessages } = useChatStore(
    (state) => state
  );
  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!currentConversation) {
      return;
    }
    // Fetch messages for the current conversation
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?conversationId=${currentConversation}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentConversation]);

  return (
    <>
      <SlideOverMenu />

      <LeftSidebar />
      <ChatList />

      <ChatMessagesArea />
      <Sidebar />
    </>
  );
}
