import { FlagIcon, PackageIcon, XIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "../utils/classnames";
import { useEffect } from "react";
import { useChatStore } from "../store";

export function Sidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {
    isSidebarHidden: isHidden,
    toggleSidebar: toggle,
    conversations,
    messages,
    currentConversation,
  } = useChatStore((state) => state);
  const conversation = currentConversation
    ? conversations.find(({ id }) => id === currentConversation) ?? null
    : null;

  useEffect(() => {
    if (
      window.innerWidth < 1280 &&
      !isHidden &&
      !(window as any)["toggleSidebar"]
    ) {
      (window as any)["toggleSidebar"] = "done";
      toggle();
    }
  }, []);

  if (isHidden) return null;

  return (
    <aside
      className={cn(
        "max-w-72 truncate fixed top-0 right-0 z-50 shadow-[0_0_2px_1px_rgb(0 0 0 / 10%)] xl:shadow-none xl:z-0 xl:static bg-background-light border-l border-stroke p-4 h-screen transform transition-transform duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Model Info</h2>
        <button
          className="text-foreground hover:text-gray-300 cursor-pointer"
          onClick={toggle}
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Modal</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-background rounded-lg overflow-hidden">
              <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center text-foreground">
                <PackageIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <a
                  href="https://huggingface.co/google/gemma-3-1b-it"
                  className="font-medium truncate break-all w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  google/gemma-3-1b-it
                </a>
                <p className="text-xs text-foreground truncate">
                  Google DeepMind
                </p>
              </div>
            </div>
          </div>
        </div>
        {conversation && (
          <div className="border-t border-stroke pt-6">
            <h3 className="font-semibold mb-3">Conversation Summary</h3>
            <div className="space-y-2">
              <div className="flex gap-3 p-2 bg-background rounded-lg">
                <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center text-foreground">
                  <FlagIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <p className="font-medium truncate">{conversation.title}</p>
                  <p className="text-xs text-foreground">
                    updated{" "}
                    {formatDistance(conversation.updatedAt!, Date.now(), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-foreground">
                    {messages.length} messages
                  </p>
                  <p className="text-xs text-foreground">
                    Created{" "}
                    {formatDistance(conversation.createdAt!, Date.now(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
