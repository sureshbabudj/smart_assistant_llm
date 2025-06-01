import express, { Request, Response } from "express";
import { getPrismaInstance } from "./prisma";
import { authMiddleware } from "./middleware";
import { sessionKey } from "./utils";
import { activeSseConnections, getOrCreateLlamaSession } from "./llama";

const prisma = getPrismaInstance();

export const chatRouter = express.Router();
chatRouter.use(authMiddleware);

// --- SSE endpoint for chat ---
chatRouter.get("/stream", (req: any, res: Response): any => {
  const { userId } = req.jwt;
  const conversationId = req.query.conversationId as string;
  if (!userId) {
    return res.status(400).send("User ID is required for SSE connection.");
  }
  const key = sessionKey(userId, conversationId);
  if (activeSseConnections.has(key)) {
    console.warn(`User ${userId} already has an active SSE connection.`);
    // Optionally, you could close the existing connection here
    activeSseConnections.get(key)?.end();
    activeSseConnections.delete(key);
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  activeSseConnections.set(key, res);
  console.log(
    `SSE connection established for client: ${userId}. Total active SSE connections: ${activeSseConnections.size}`
  );

  res.write(
    `event: connected\ndata: ${JSON.stringify({
      message: `Connected to chat stream for ${userId}`,
    })}\n\n`
  );

  let closed = false;
  const cleanup = () => {
    if (!closed) {
      closed = true;
      activeSseConnections.delete(key);
      console.log(
        `SSE connection closed for client: ${userId}. Total active SSE connections: ${activeSseConnections.size}`
      );
    }
  };

  req.on("close", cleanup);
  req.on("end", cleanup);
});

chatRouter.post("/", async (req: any, res): Promise<any> => {
  try {
    const { userId } = req.jwt;
    const conversationId = req.body.conversationId;
    const message = req.body.message;
    if (!message || !conversationId) {
      return res.status(400).json({ error: "Invalid request." });
    }
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversationId,
        sender: "user",
        content: message,
      },
    });
    const llamaSession = await getOrCreateLlamaSession(userId, conversationId);
    if (!llamaSession) {
      return res.status(500).json({ error: "Failed to create Llama session." });
    }
    const sseConnection = activeSseConnections.get(
      sessionKey(userId, conversationId)
    );
    if (!sseConnection) {
      console.warn(
        `No active SSE connection for user ${userId}, conversation ${conversationId}.`
      );
      return res.status(400).send("No active SSE connection.");
    }

    let aiMessage = "";
    sseConnection.write(
      `event: start\ndata: ${JSON.stringify({
        message: "AI response starting...",
      })}\n\n`
    );

    await llamaSession.session.promptWithMeta(message, {
      onResponseChunk: (chunk) => {
        const data = {
          type: chunk.type,
          segmentType: chunk.segmentType,
          text: chunk.text,
        };
        aiMessage += chunk.text;
        sseConnection.write(
          `event: token\ndata: ${JSON.stringify({ token: chunk.text })}\n\n`
        );
      },
    });

    sseConnection.write(
      `event: end\ndata: ${JSON.stringify({
        message: "AI response complete.",
      })}\n\n`
    );

    await prisma.message.create({
      data: {
        conversationId: conversationId,
        sender: "assistant",
        content: aiMessage,
      },
    });
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
      },
    });
    const messages = updatedConversation.messages;
    delete updatedConversation.messages; // Remove messages from the conversation object
    return res
      .status(201)
      .json({ conversation: updatedConversation, messages });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
