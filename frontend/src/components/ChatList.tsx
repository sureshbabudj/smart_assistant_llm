import { FlagIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "../utils/classnames";
import React, { useEffect, useState } from "react";
import { useChatStore } from "../store";
import type { Conversation, ConversationsMap } from "../types";

function sortConversationsMap(conversations: ConversationsMap): Conversation[] {
  return Object.values(conversations).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function ChatList({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {
    isChatListHidden: isHidden,
    conversations,
    currentConversation: activeConversationId,
    setCurrentConversation,
    updateConversation,
  } = useChatStore((state) => state);

  const sortedConversations = sortConversationsMap(conversations);

  const [filterConversations, setFilterConversations] = useState<
    Conversation[]
  >([...sortedConversations]);

  const handleSearchQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (!value || value.length === 0) {
      setFilterConversations(sortedConversations);
      return;
    }

    if (value.length < 3) {
      return;
    }

    const filtered = sortedConversations.filter((conv: Conversation) =>
      conv.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilterConversations(filtered);
  };

  useEffect(() => {
    setFilterConversations(sortConversationsMap(conversations));
  }, [conversations]);

  return (
    <aside
      className={cn(
        "min-w-48 hidden lg:block bg-background-light border-r border-stroke",
        className,
        isHidden && "lg:hidden!"
      )}
      {...props}
    >
      <div className="p-4">
        <div className="relative">
          <input
            placeholder="Search"
            className="w-full bg-background rounded-xl py-2 pl-10 pr-4 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyUp={handleSearchQuery}
          />
          <svg
            className="w-5 h-5 text-foreground absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        <div className="px-2 space-y-1">
          {filterConversations.map((conv, idx) => (
            <div
              key={conv.id}
              className={cn(
                "p-3 rounded-xl hover:bg-background flex items-center gap-3 active:bg-background cursor-pointer",
                activeConversationId === conv.id && "bg-background"
              )}
              onClick={() => setCurrentConversation(conv.id)}
            >
              <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-2xl font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {conv.title}
                  </h3>
                  <button
                    className={cn(
                      "cursor-pointer hover:text-active-foreground",
                      conv.isFlagged ? "text-red-500" : "text-foreground"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateConversation(conv.id, {
                        ...conv,
                        isFlagged: !conv.isFlagged,
                      });
                    }}
                  >
                    <FlagIcon className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="text-sm text-foreground truncate"
                  suppressHydrationWarning
                >
                  {formatDistance(new Date(conv.createdAt), Date.now(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
