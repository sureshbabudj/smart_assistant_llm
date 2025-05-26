import {
  NotebookIcon,
  EditIcon,
  MenuIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "../utils/classnames";
import { useChatStore } from "../store";
import type { Conversation, DropdownItem } from "../types";
import { DropdownMenu } from "./DropdownMenu";
import { useState } from "react";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "./Modal";

function DownloadLink({
  href = "#",
  download = "chat.json",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      download={download}
      className="p-3 block text-center bg-highlight text-background border rounded-full w-full font-semibold"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      Download Chat
    </a>
  );
}

export function ChatHeader() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const {
    conversations,
    currentConversation,
    toggleSidebar,
    toggleSlideOverMenu,
    setCurrentConversation,
    removeConversation,
    updateConversation,
  } = useChatStore((state) => state);
  const conversation = currentConversation
    ? conversations[currentConversation] ?? null
    : null;

  const showMoreOptionsItems: DropdownItem[] = [
    {
      id: "edit",
      label: "Edit",
      icon: "edit",
    },
    {
      id: "delete",
      label: "Delete",
      icon: "delete",
    },
    {
      id: "export",
      label: "Export",
      icon: "export",
    },
    {
      id: "share",
      label: "Share",
      icon: "share",
    },
  ];

  const getDownloadUrl = () => {
    if (!conversation) return "";
    const data = JSON.stringify(conversation, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const handleSelect = (item: DropdownItem, conversation: Conversation) => {
    switch (item.id) {
      case "edit":
        editTitle(conversation);
        break;
      case "delete":
        console.log("Delete chat");
        removeConversation(conversation.id);
        break;
      case "export":
        const url = getDownloadUrl();
        url && setDownloadUrl(url);
        setIsModalOpen(true);
        break;
      case "share":
        const shareUrl = getDownloadUrl();
        if (!shareUrl) return;
        navigator.share({
          title: conversation.title,
          text: "Check out this chat!",
          url: window.location.href + `?download=${conversation.id}`,
        });
        console.log("Share chat");
        break;
      default:
        break;
    }
  };

  const handleTitleUpdate = () => {
    if (editedTitle.trim() === "") {
      setEditedTitle(conversation?.title || "");
      return;
    }
    if (conversation) {
      updateConversation(conversation.id, {
        ...conversation,
        title: editedTitle.trim(),
      });
    }
    setIsEditingTitle(false);
  };

  const editTitle = (conversation: Conversation) => {
    setIsEditingTitle(true);
    setEditedTitle(conversation.title);
  };

  return (
    <header
      className={cn(
        "p-4  flex items-center justify-between",
        conversation && "border-b border-stroke"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          className="w-10 h-10 lg:hidden rounded-xl bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer flex items-center justify-center"
          onClick={toggleSlideOverMenu}
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        {conversation && (
          <>
            <h1 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[300px]">
              {isEditingTitle ? (
                <input
                  className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[300px] bg-transparent border-b border-highlight focus:outline-none"
                  value={editedTitle}
                  autoFocus
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTitleUpdate();
                    }
                  }}
                />
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => editTitle(conversation)}
                >
                  {conversation.title}
                </span>
              )}
            </h1>
            <span className="text-sm text-foreground" suppressHydrationWarning>
              {formatDistance(new Date(conversation.createdAt), Date.now(), {
                addSuffix: true,
              })}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          className="w-10 h-10 lg:hidden rounded-xl bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer flex items-center justify-center"
          onClick={toggleSidebar}
        >
          <NotebookIcon className="w-5 h-5" />
        </button>
        {conversation && (
          <>
            <button
              className="w-10 h-10 hidden lg:flex rounded-xl bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer items-center justify-center"
              onClick={() => removeConversation(conversation.id)}
            >
              <Trash2Icon className="w-5 h-5" />
            </button>
            <button
              className="w-fit px-2 h-10 rounded-xl bg-highlight text-background hover:bg-foreground hover:text-active-background cursor-pointer flex items-center justify-center font-bold"
              onClick={() => setCurrentConversation(null)}
            >
              <EditIcon className="w-5 h-5 sm:pr-1" />
              <span className="hidden lg:block">New Chat</span>
            </button>
            <DropdownMenu
              items={showMoreOptionsItems}
              handleSelect={(param) => handleSelect(param, conversation)}
            >
              <button className="w-10 h-10 rounded-xl bg-background text-foreground hover:bg-active-background hover:text-active-foreground cursor-pointer flex items-center justify-center">
                <MoreVerticalIcon className="w-5 h-5" />
              </button>
            </DropdownMenu>
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal>
          <ModalHeader>Download</ModalHeader>
          <ModalContent>
            <DownloadLink
              href={downloadUrl}
              download={conversation ? `${conversation.id}.json` : ""}
            />
          </ModalContent>
          <ModalFooter>
            <button
              className="p-3 bg-foreground text-background border rounded-full w-full font-semibold"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </ModalFooter>
        </Modal>
      )}
    </header>
  );
}
