import { useCallback, useRef } from "react";
import { useChatStore } from "../store";
import { createMessage } from "../utils/conversation-utils";

interface ChatStreamData {
  type: "start" | "end" | "error" | string;
  message?: string;
  text?: string;
}

const API_URL = `${
  process.env.NODE_ENV !== "production" ? "http://localhost:5188" : ""
}/api/chat-stream`;

export const useChatEngine = () => {
  const {
    currentConversation: activeConversationId,
    setInputs,
    createConversation,
    output,
    setOutput,
    setLoading,
    inputs,
  } = useChatStore((state) => state);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInput = async (value: string) => {
    if (!value) {
      return;
    }
    setLoading(true);

    if (inputRef.current) inputRef.current.value = "";

    if (!activeConversationId) {
      console.error("creating new conversation");
      createConversation(value);
    } else {
      setInputs(createMessage({ sender: "user", content: value }));
    }

    let all = "";
    inputs.forEach(({ sender, content }) => {
      all += `${
        sender === "assistant" ? "### Me" : "### Human"
      } \n ${content}; \n`;
    });
    all += `### Human: \n ${value}\n`;
    await handleSend(all);
  };

  const handleSend = useCallback(async (prompt: string): Promise<void> => {
    let reply = "";
    try {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const reader = (response.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let isDone = false;

      while (!isDone) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: ChatStreamData = JSON.parse(line.substring(6));
              if (data.type === "end") {
                isDone = true;
                console.log("Stream ended:", reply);
                break;
              } else if (data.type === "error") {
                isDone = true;
                console.error("Stream error:", data.message || "Unknown error");
                break;
              } else if (data.type === "start" && data.message) {
                // Optionally handle start message
                console.log("Stream started:", data.message);
              } else {
                reply += data.text || "";
                setOutput({ ...output, isLoading: true, content: reply });
              }
            } catch (e: any) {
              throw new Error(`Error parsing stream data: ${e.message}`);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error in handleSend:", error);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      setOutput({ ...output, isLoading: false, content: "" });
      setInputs({ ...output, isLoading: false, content: reply });
    }
  }, []);

  return { inputRef, handleInput };
};
