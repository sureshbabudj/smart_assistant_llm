import {
  Loader2,
  SendHorizontalIcon,
  SquareChevronRightIcon,
} from "lucide-react";
import React from "react";
import { useChatStore } from "../store";
import { useInput } from "../hook/useInput";

export function ChatFooter() {
  const { streaming: loading } = useChatStore((state) => state);
  const { handleInput, inputRef } = useInput();

  const handleSubmit = () => {
    const value = inputRef.current?.value.trim();
    if (value) {
      handleInput(value);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="p-4 border-t border-stroke">
      <div className="flex items-center gap-2 bg-background rounded-xl p-2">
        <div className="p-2 rounded-lg text-foreground">
          <SquareChevronRightIcon className="w-6 h-6" />
        </div>
        <textarea
          name="message"
          id="message"
          ref={inputRef}
          onKeyDown={handleEnter}
          rows={3}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent focus:outline-none text-foreground placeholder-gray-400 resize-none"
        ></textarea>
        <button
          onClick={handleSubmit}
          className="p-2 mx-3 bg-highlight hover:bg-background-light text-background hover:text-foreground-light rounded-full"
        >
          {!loading ? (
            <SendHorizontalIcon className="w-6 h-6" />
          ) : (
            <Loader2 className="w-6 h-6 animate-spin" />
          )}
        </button>
      </div>
    </footer>
  );
}
