import { fileURLToPath } from "url";
import path from "path";
import {
  getLlama,
  LlamaChatSession,
  LlamaContext,
  LlamaModel,
} from "node-llama-cpp";
import express, { Request, Response } from "express";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let session: LlamaChatSession, model: LlamaModel, context: LlamaContext;

async function getLlamaSession() {
  const llama = await getLlama();
  if (!model || model.disposed) {
    // Download the model if it doesn't exist
    // follow the instructions from the node-llama-cpp documentation
    console.log("loading model...");
    model = await llama.loadModel({
      modelPath: path.join(__dirname, "models", "gemma-3-1b-it-q6_k.gguf"),
    });
  }
  if (!context || context.disposed) {
    // Create a new context if it doesn't exist
    console.log("Creating new context...");
    // Clear any previous context

    context = await model.createContext();
  }
  if (!session || session.disposed) {
    // Dispose of the previous session to clear sequences and history
    console.log("Disposing previous session...");
    session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });
  }

  return { session, model, context };
}

async function disposeLlamaSession(session, model, context) {
  try {
    if (session && !session.disposed) {
      console.log("Disposing session...");
      await session.dispose();
    }
    if (context && !context.disposed) {
      console.log("Disposing context...");
      await context.dispose();
    }
    if (model && !session.disposed) {
      console.log("Disposing model...");
      await model.dispose();
    }
    session = null;
    model = null;
    context = null;
    console.log("All resources disposed.");
    console.log("Llama session disposed.");
  } catch (error) {
    console.error("Error disposing Llama session:", error);
  }
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.post("/api/chat-stream", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Received prompt: ${prompt}`);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // clear l session context if needed
    const { session } = await getLlamaSession();
    await session.promptWithMeta(prompt, {
      onResponseChunk(chunk) {
        // Serialize the chunk with type and content for clarity
        const data = {
          type: chunk.type,
          segmentType: chunk.segmentType,
          text: chunk.text,
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        // Optional: log to server console for debugging
        // if (chunk.type === "segment") {
        //   process.stdout.write(` [segment start: ${chunk.segmentType}] `);
        // }
        // process.stdout.write(chunk.text);
        // if (chunk.type === "segment") {
        //   process.stdout.write(` [segment end: ${chunk.segmentType}] `);
        // }
      },
    });

    res.end();
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await disposeLlamaSession(session, model, context);
  }
});

app.listen(5188, () => {
  console.log("Server is running on http://localhost:5188");
});
