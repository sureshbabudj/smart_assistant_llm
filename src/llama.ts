import {
  Llama,
  LlamaChatSession,
  LlamaContext,
  LlamaModel,
  getLlama as getLlamaInstance,
} from "node-llama-cpp";

import { Response } from "express";

import { fileURLToPath } from "url";
import path from "path";
import { sessionKey } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let llamaInstance: Llama | null = null;

interface ActiveLlamaSessionEntry {
  session: LlamaChatSession;
  model: LlamaModel;
  context: LlamaContext;
}

const CONTEXT_WINDOW_SIZE = 5;
const LLAMA_CONTEXT_TOKEN_LIMIT = 2048;

export const activeSseConnections = new Map<string, Response>();
export const activeLlamaSessions = new Map<string, ActiveLlamaSessionEntry>();

export async function getLlama(): Promise<Llama> {
  if (!llamaInstance) llamaInstance = await getLlamaInstance();
  return llamaInstance;
}

export async function getOrCreateLlamaSession(
  userId: string,
  conversationId: string
): Promise<ActiveLlamaSessionEntry> {
  const key = sessionKey(userId, conversationId);
  if (activeLlamaSessions.has(key)) return activeLlamaSessions.get(key)!;
  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(__dirname, "models", "gemma-3-1b-it-q6_k.gguf"),
  });
  const context = await model.createContext({
    contextSize: LLAMA_CONTEXT_TOKEN_LIMIT,
  });
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
  });
  const sessionEntry: ActiveLlamaSessionEntry = { session, model, context };
  activeLlamaSessions.set(key, sessionEntry);
  return sessionEntry;
}

export function summarizeMessage(message: string): string {
  const maxLength = 200;
  return message.length > maxLength
    ? message.substring(0, maxLength) + "..."
    : message;
}
