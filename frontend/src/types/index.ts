export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  isLoading?: boolean;
  error?: string;
  isError?: boolean;
  isSuccess?: boolean;
  isCompleted?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  isFlagged?: boolean;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsMap {
  [key: string]: Conversation;
}

export interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  isDisabled?: boolean;
}
