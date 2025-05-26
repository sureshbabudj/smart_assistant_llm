import { useChatStore } from "../store";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "./Modal";

export function EditLayout({ hide }: { hide: () => void }) {
  const { toggleChatList, isChatListHidden, isSidebarHidden, toggleSidebar } =
    useChatStore((state) => state);

  const handleToggleChatList = () => {
    toggleChatList();
  };

  const handleToggleRightSidebar = () => {
    toggleSidebar();
  };

  return (
    <Modal>
      <ModalHeader>Edit Layout</ModalHeader>
      <ModalContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between gap-2 my-2">
            <span className="inline-block mr-0.5">
              Toggle Conversation List
            </span>
            <div className="relative inline-block w-11 h-5">
              <input
                checked={!isChatListHidden}
                id="toggle-conversation-list"
                type="checkbox"
                className="peer appearance-none w-11 h-6 bg-background rounded-full  border border-highlight checked:bg-background-light cursor-pointer transition-colors duration-300 checked:border-highlight"
                onChange={handleToggleChatList}
              />
              <label
                htmlFor="toggle-conversation-list"
                className="absolute top-0 left-0 w-6 h-6 bg-highlight rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer"
              ></label>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-2  my-2">
            <span className="inline-block mr-0.5">Toggle Right Sidebar</span>
            <div className="relative inline-block w-11 h-5">
              <input
                checked={!isSidebarHidden}
                id="toggle-right-sidebar"
                type="checkbox"
                className="peer appearance-none w-11 h-6 bg-background rounded-full  border border-highlight checked:bg-background-light cursor-pointer transition-colors duration-300 checked:border-highlight"
                onChange={handleToggleRightSidebar}
              />
              <label
                htmlFor="toggle-right-sidebar"
                className="absolute top-0 left-0 w-6 h-6 bg-highlight rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer"
              ></label>
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <button
          className="p-3 mt-4 bg-foreground text-background border rounded-full w-full font-semibold"
          onClick={hide}
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}
