import { useRef } from "react";
import { useChatStore } from "../store";

export const useInput = () => {
  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    setMessages,
  } = useChatStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = async (message: string) => {
    if (!message) return;
    let conversationId = currentConversation;
    if (!conversationId) {
      // Create a new conversation if none is selected
      const newConversation = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ title: message }),
      });
      if (!newConversation.ok) {
        console.error("Failed to create conversation");
        return;
      }
      const data = await newConversation.json();
      setConversations([...conversations, data]);
      conversationId = data.id;

      // wait for the sse connection to be established
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentConversation(conversationId);
      setMessages([]);
    }

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ message, conversationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      inputRef.current!.value = "";
    }
  };

  return { inputRef, handleInput };
};
