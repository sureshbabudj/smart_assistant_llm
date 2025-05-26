import { create } from "zustand";
import type { Message, Conversation, ConversationsMap } from "../types";
import { persist, devtools } from "zustand/middleware";
import { createConversation, createMessage } from "../utils/conversation-utils";

export interface AppState {
  isSidebarHidden: boolean;
  isChatListHidden: boolean;
  isSlideOverMenuOpen: boolean;
  conversations: ConversationsMap;
  currentConversation?: string | null;
  inputs: Message[];
  loading: boolean;
  output: Message;
}

export type ChatStoreType = {
  updateConversation: (id: string, conv: Conversation) => void;
  setCurrentConversation: (currentConversation: string | null) => void;
  setConversations: (conversations: ConversationsMap) => void;
  createConversation: (msg: string) => void;
  setInputs: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setOutput: (msg: Message) => void;
  toggleSidebar: () => void;
  toggleChatList: () => void;
  toggleSlideOverMenu: () => void;
  removeConversation: (id: string) => void;
  getRecentConversation: () => string | null;
} & AppState;

export const useChatStore = create<ChatStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        isChatListHidden: false,
        isSidebarHidden: false,
        isSlideOverMenuOpen: false,
        currentConversation: null,
        conversations: {},
        inputs: [],
        loading: false,
        output: createMessage({ sender: "assistant", content: "" }),

        toggleSidebar: () =>
          set((state) => ({ isSidebarHidden: !state.isSidebarHidden })),
        toggleChatList: () =>
          set((state) => ({ isChatListHidden: !state.isChatListHidden })),
        toggleSlideOverMenu: () =>
          set((state) => ({
            isSlideOverMenuOpen: !state.isSlideOverMenuOpen,
          })),

        updateConversation: (id, conversation) => {
          const { conversations } = get();
          const updatedConversations = { ...conversations };
          if (updatedConversations[id]) {
            set({
              conversations: { ...updatedConversations, [id]: conversation },
            });
          } else {
            console.error(`Conversation with id ${id} does not exist.`);
          }
        },

        createConversation: (msg: string) => {
          const { conversations } = get();
          const message = createMessage({
            sender: "user",
            content: msg,
          });
          const newConversation = createConversation({
            messages: [message],
          });
          set({
            currentConversation: newConversation.id,
            conversations: {
              ...conversations,
              [newConversation.id]: newConversation,
            },
            inputs: [message],
          });
        },

        getRecentConversation: () => {
          const { conversations } = get();
          const conversationIds = Object.keys(conversations);
          if (conversationIds.length === 0) return null;
          const recentId = conversationIds.reduce((a, b) =>
            conversations[a].updatedAt > conversations[b].updatedAt ? a : b
          );
          return recentId;
        },

        removeConversation: (id: string) => {
          const { conversations, currentConversation, getRecentConversation } =
            get();
          if (!conversations[id]) {
            console.error(`Conversation with id ${id} does not exist.`);
            return;
          }
          const updatedConversations = { ...conversations };
          delete updatedConversations[id];

          const updatedCurrentConversation = () => {
            return currentConversation === id
              ? getRecentConversation() || null
              : currentConversation;
          };
          const updatedCurrentConvId = updatedCurrentConversation();
          set({
            conversations: updatedConversations,
            currentConversation: updatedCurrentConvId,
            inputs: updatedCurrentConvId
              ? conversations[updatedCurrentConvId].messages
              : [],
          });
        },

        setCurrentConversation: (currentConversation) => {
          if (currentConversation === null) {
            set({ currentConversation: null, inputs: [] });
            return;
          }
          // When switching conversation, update inputs to match the selected conversation
          const conversations = get().conversations;
          set({
            currentConversation,
            inputs: conversations[currentConversation].messages,
          });
        },

        setConversations: (conv: ConversationsMap) =>
          set((state) => ({
            conversations: { ...state.conversations, ...conv },
          })),

        setInputs: (msg) => {
          const { currentConversation, conversations, inputs } = get();
          if (!currentConversation || !conversations[currentConversation]) {
            console.error("No current conversation set");
            return;
          }
          const updatedInputs = [...inputs, msg];
          set({
            inputs: updatedInputs,
            conversations: {
              ...conversations,
              [currentConversation]: {
                ...conversations[currentConversation],
                updatedAt: new Date().toISOString(),
                messages: updatedInputs,
              },
            },
          });
        },

        setLoading: (loading) => set(() => ({ loading })),
        setOutput: (msg) => set(() => ({ output: msg })),
      }),
      {
        name: "smart-coding-assistant-store",
        partialize: (state) => ({
          conversations: state.conversations,
        }),
      }
    )
  )
);
