import { useEffect, useRef, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

export const useSSE = (url: string, conversationId: string | null) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log("Closed existing SSE connection.");
    }

    const eventSource = new EventSourcePolyfill(
      `${url}?conversationId=${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      }
    );
    eventSourceRef.current = eventSource;
    console.log(
      `Attempting to connect to SSE for conversationId: ${conversationId}`
    );

    eventSource.onopen = () => {
      console.log("SSE connection opened.");
      setIsConnected(true);
      setError(null);
    };

    eventSource.onerror = (event) => {
      console.error("SSE Error:", event);
      setIsConnected(false);
      setError("An error occurred while connecting to the server.");
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("SSE connection closed on component unmount.");
      }
    };
  }, [conversationId]);

  return { isConnected, error, eventSourceRef };
};
