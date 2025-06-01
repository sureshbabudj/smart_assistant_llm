import { FlagIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "../utils/classnames";
import React, { useEffect, useState } from "react";
import { useChatStore } from "../store";
import type { Conversation } from "@prisma/client";

export function ChatList({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {
    isChatListHidden: isHidden,
    conversations,
    currentConversation: activeConversationId,
    setCurrentConversation,
    fetchConversations,
  } = useChatStore((state) => state);

  const [filterConversations, setFilterConversations] =
    useState<Conversation[]>(conversations);

  const handleSearchQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (!value || value.length === 0) {
      setFilterConversations([...conversations]);
      return;
    }

    if (value.length < 3) {
      return;
    }

    const filtered = conversations.filter((conv: Conversation) =>
      conv.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilterConversations(filtered);
  };

  const handleFlagConversation = async (
    e: React.MouseEvent,
    conv: Conversation
  ) => {
    e.stopPropagation();
    // Here you would typically toggle the flag state in your backend
    try {
      const response = await fetch(`/api/conversations/${conv.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ isFlagged: !conv.isFlagged }),
      });
      if (!response.ok) {
        throw "Failed to update conversation flag status";
      }
      await fetchConversations();
    } catch (error) {
      console.error("Failed to toggle flag status:", error);
      return;
    }
  };

  useEffect(() => {
    // Reset filter when conversations change
    setFilterConversations([...conversations]);
  }, [conversations]);

  return (
    <aside
      className={cn(
        "hidden max-w-72 overflow-hidden lg:block bg-background-light border-r border-stroke",
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
          {filterConversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          )}
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
                  <h3 className="font-semibold text-foreground text-ellipsis overflow-hidden text-nowrap pe-2">
                    {conv.title}
                  </h3>
                  <button
                    className={cn(
                      "cursor-pointer hover:text-active-foreground",
                      conv.isFlagged ? "text-red-500" : "text-foreground"
                    )}
                    onClick={(e) => handleFlagConversation(e, conv)}
                  >
                    <FlagIcon className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="text-sm text-foreground truncate"
                  suppressHydrationWarning
                >
                  {formatDistance(conv.createdAt!, Date.now(), {
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
