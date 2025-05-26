import {
  AlignLeftIcon,
  NotebookIcon,
  Settings2Icon,
  User2Icon,
} from "lucide-react";
import { cn } from "../utils/classnames";
import React, { useState } from "react";
import { useChatStore } from "../store";
import { Logo } from "./Logo";
import { EditLayout } from "./EditLayout";

export function LeftSidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { toggleChatList, toggleSidebar, conversations } = useChatStore(
    (state) => state
  );
  const [isEditLayoutShown, setIsEditLayoutShown] = useState<boolean>(false);
  const length = Object.keys(conversations).length;
  return (
    <aside
      className={cn(
        "w-20 hidden md:flex flex-col items-center py-6 bg-background-light border-r border-stroke",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-8">
        <Logo />
      </div>
      <nav className="space-y-6 flex-1">
        <button
          className="w-12 h-12 hidden lg:flex bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer rounded-xl items-center justify-center relative"
          onClick={toggleChatList}
        >
          <AlignLeftIcon className="w-6 h-6" />
          {length !== 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-highlight text-background rounded-full text-xs flex items-center justify-center">
              {length}
            </span>
          )}
        </button>
        <button
          className="w-12 h-12 hidden lg:flex bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer rounded-xl items-center justify-center relative"
          onClick={toggleSidebar}
        >
          <NotebookIcon className="w-6 h-6" />
        </button>
      </nav>
      <div className="mt-auto space-y-6">
        <button className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-foreground">
          <Settings2Icon
            className="w-6 h-6"
            onClick={() => setIsEditLayoutShown(!isEditLayoutShown)}
          />
        </button>
        <button className="w-12 h-12 rounded-xl overflow-hidden border border-stroke text-foreground">
          <User2Icon className="p-2 w-full h-full object-cover" />
        </button>
      </div>
      {isEditLayoutShown && (
        <EditLayout hide={() => setIsEditLayoutShown(false)} />
      )}
    </aside>
  );
}
