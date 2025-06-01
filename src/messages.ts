import express from "express";
import { getPrismaInstance } from "./prisma";
import { authMiddleware } from "./middleware";

const prisma = getPrismaInstance();

export const messageRouter = express.Router();

messageRouter.use(authMiddleware);
messageRouter.get("/", async (req: any, res) => {
  const { conversationId } = req.query;
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { timestamp: "asc" },
  });
  res.json(messages);
});

messageRouter.post("/", async (req: any, res) => {
  const { conversationId, sender, content } = req.body;
  const message = await prisma.message.create({
    data: { conversationId, sender, content },
  });
  res.status(201).json(message);
});

messageRouter.get("/:id", async (req: any, res): Promise<any> => {
  const message = await prisma.message.findUnique({
    where: { id: req.params.id },
  });
  if (!message) return res.status(404).json({ error: "Not found." });
  res.json(message);
});

messageRouter.put("/:id", async (req: any, res) => {
  const { content } = req.body;
  const message = await prisma.message.update({
    where: { id: req.params.id },
    data: { content },
  });
  res.json(message);
});

messageRouter.delete("/:id", async (req: any, res) => {
  await prisma.message.delete({ where: { id: req.params.id } });
  res.json({ message: "Message deleted." });
});
