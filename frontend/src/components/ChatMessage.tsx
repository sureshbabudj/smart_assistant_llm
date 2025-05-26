import { AlarmClockCheck, RotateCcwIcon, User2Icon } from "lucide-react";
import { formatDate } from "date-fns";
import { cn } from "../utils/classnames";
import type { Message } from "../types";
import { useShowDown } from "../hook/useShowdown";
import { Logo } from "./Logo";

export function ChatMessage({
  message,
  isLast,
  rewind,
}: {
  message: Message;
  isLast?: boolean;
  rewind: () => void;
}) {
  const { html } = useShowDown(message.content);
  const isUser = message.sender === "user";
  return (
    <div className="flex gap-4 ml-auto">
      {isUser ? (
        <User2Icon className="w-10 h-10 rounded-xl p-2 bg-background border-stroke" />
      ) : (
        <Logo className="w-10 h-10 rounded-xl p-1 bg-background border-stroke" />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">{isUser ? "You" : "Assistant"}</span>
          <AlarmClockCheck className="w-4 h-4 text-foreground" />
          <span className="text-xs text-foreground">
            {formatDate(new Date(message.timestamp), "MMM do, yyyy, h:mmaaa")}
          </span>
        </div>
        <div
          className={cn(
            "rounded-xl p-4",
            isUser
              ? "bg-background"
              : "bg-background-light border border-stroke"
          )}
        >
          <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          {!isUser && isLast && !message.isLoading && (
            <button
              className="px-2 py-1 bg-background rounded-lg text-xs flex items-center gap-1"
              onClick={rewind}
            >
              <RotateCcwIcon className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs text-foreground">
            {message.isLoading ? "Thinking..." : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
