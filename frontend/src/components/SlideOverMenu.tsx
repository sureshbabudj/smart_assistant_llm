import { XIcon } from "lucide-react";
import { cn } from "../utils/classnames";
import { useChatStore } from "../store";
import { LeftSidebar } from "./LeftSidebar";
import { ChatList } from "./ChatList";

export function SlideOverMenu() {
  const { isSlideOverMenuOpen: isOpen, toggleSlideOverMenu: toggle } =
    useChatStore((state) => state);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-sm transition-transform duration-300 ease-in-out transform lg:hidden",
        !isOpen ? "-translate-x-full" : "translate-x-0"
      )}
      onClick={() => toggle()}
    >
      <button
        className="absolute top-4 right-8 w-10 h-10 rounded-xl bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <XIcon className=" w-8 h-6" />
      </button>

      <div
        className="flex shadow-[3px_0_3px_0px_rgb(0 0 0 / 10%)] w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        <LeftSidebar className="flex! md:invisible! w-fit!" />
        <ChatList className="block! w-fit!" />
      </div>
    </div>
  );
}
