import { SlideOverMenu } from "./SlideOverMenu";
import { LeftSidebar } from "./LeftSidebar";
import { ChatList } from "./ChatList";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { Sidebar } from "./Sidebar";

export function ChatWrapper() {
  return (
    <div className="flex h-full">
      <SlideOverMenu />

      <LeftSidebar />
      <ChatList />

      <ChatMessagesArea />
      <Sidebar />
    </div>
  );
}
