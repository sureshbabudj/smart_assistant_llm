import { useEffect, useState } from "react";
import { useChatStore } from "../store";

export const useStreamingMessages = (
  eventSourceRef: React.MutableRefObject<EventSource | null>
): {
  status: "progress" | "end" | "error";
  token: string | null;
} => {
  const { currentConversation } = useChatStore((state) => state);
  const { setStreaming } = useChatStore((state) => state);
  const [status, setStatus] = useState<"progress" | "end" | "error">(
    "progress"
  );
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = eventSourceRef.current;

    if (!eventSource) return;

    const handleStart = () => {
      setStreaming(true);
      setStatus("progress");
      setToken("");
      console.log("SSE streaming started.");
    };

    const handleToken = (event: MessageEvent) => {
      setStreaming(true);
      setStatus("progress");
      const data = JSON.parse(event.data);
      console.log("Received token:", data.token);
      setToken((prev) => (prev ? prev + data.token : data.token));
    };

    const handleEnd = () => {
      setStreaming(false);
      setToken(null);
      setStatus("end");
      console.log("SSE streaming ended.");
    };

    const handleError = () => {
      setStreaming(false);
      setStatus("error");
      console.error("SSE error occurred.");
    };

    const onConnect = (o: unknown) => {
      console.log("onConnect", o);
    };
    const onReconnect = (o: unknown) => {
      console.log("onReconnect", o);
    };
    const onJoin = (_user: unknown) => {
      console.log("onJoin", _user);
    };
    const onLeave = (_user: unknown) => {
      console.log("onJoin", _user);
    };

    eventSource.addEventListener("connect", onConnect);
    eventSource.addEventListener("reconnect", onReconnect);
    eventSource.addEventListener("join", onJoin);
    eventSource.addEventListener("leave", onLeave);

    eventSource.addEventListener("start", handleStart);
    eventSource.addEventListener("token", handleToken);
    eventSource.addEventListener("end", handleEnd);
    eventSource.addEventListener("error", handleError);

    return () => {
      eventSource.removeEventListener("start", handleStart);
      eventSource.removeEventListener("message", handleToken);
      eventSource.removeEventListener("end", handleEnd);
      eventSource.removeEventListener("error", handleError);
      eventSource.removeEventListener("connect", onConnect);
      eventSource.removeEventListener("reconnect", onReconnect);
      eventSource.removeEventListener("join", onJoin);
      eventSource.removeEventListener("leave", onLeave);
      eventSource.close();
      console.log("SSE connection closed on cleanup.");
    };
  }, [currentConversation]);

  return { status, token };
};
