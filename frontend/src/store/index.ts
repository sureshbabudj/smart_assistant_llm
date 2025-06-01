import type { Conversation, Message } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ChatStore {
  conversations: Conversation[];
  messages: Message[];
  currentConversation: string | null;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentConversation: (conversationId: string | null) => void;

  isSidebarHidden: boolean;
  isChatListHidden: boolean;
  isSlideOverMenuOpen: boolean;

  toggleSidebar: () => void;
  toggleChatList: () => void;
  toggleSlideOverMenu: () => void;

  streaming: boolean;
  setStreaming: (streaming: boolean) => void;

  fetchConversations: () => Promise<void>;
}

export const useChatStore = create<ChatStore>()(
  devtools((set) => ({
    conversations: [],
    messages: [],
    currentConversation: null,

    setConversations: (conversations: Conversation[]) => set({ conversations }),
    setMessages: (messages: Message[]) => set({ messages }),
    setCurrentConversation: (conversationId: string | null) => {
      set({ currentConversation: conversationId });
      // Reset messages when changing conversation
      if (conversationId) {
        set({ messages: [] });
      }
    },

    isSidebarHidden: false,
    isChatListHidden: false,
    isSlideOverMenuOpen: false,

    toggleSidebar: () =>
      set((state) => ({ isSidebarHidden: !state.isSidebarHidden })),
    toggleChatList: () =>
      set((state) => ({ isChatListHidden: !state.isChatListHidden })),
    toggleSlideOverMenu: () =>
      set((state) => ({
        isSlideOverMenuOpen: !state.isSlideOverMenuOpen,
      })),

    streaming: false,
    setStreaming: (streaming: boolean) => set({ streaming }),

    fetchConversations: async () => {
      try {
        const response = await fetch("/api/conversations", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        set({ conversations: data });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    },
  }))
);
