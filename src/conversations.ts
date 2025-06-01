import express from "express";
import { getPrismaInstance } from "./prisma";
import { authMiddleware } from "./middleware";
import { Conversation } from "@prisma/client";

const prisma = getPrismaInstance();

export const conversationRouter = express.Router();
conversationRouter.use(authMiddleware);
conversationRouter.get("/", async (req: any, res) => {
  const { userId } = req.jwt;
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  res.json(conversations);
});

conversationRouter.post("/", async (req: any, res) => {
  const { userId } = req.jwt;
  const { title } = req.body;
  const conversation = await prisma.conversation.create({
    data: { userId, title },
  });
  res.status(201).json(conversation);
});

conversationRouter.get("/:id", async (req: any, res): Promise<any> => {
  const { userId } = req.jwt;
  const conversation = await prisma.conversation.findUnique({
    where: { id: req.params.id, userId },
  });
  if (!conversation) return res.status(404).json({ error: "Not found." });
  res.json(conversation);
});

conversationRouter.put("/:id", async (req: any, res): Promise<any> => {
  try {
    const { title, isFlagged } = req.body;

    if (!title && isFlagged === undefined) {
      return res.status(400).json({ error: "No fields to update." });
    }

    const updated: Partial<Conversation> = {};
    if (title) updated.title = title;
    if (isFlagged !== undefined) updated.isFlagged = isFlagged;
    if (updated.title) updated.updatedAt = new Date();

    const conversation = await prisma.conversation.update({
      where: { id: req.params.id },
      data: updated,
    });
    res.json(conversation);
  } catch (error) {
    console.error("Error updating conversation:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

conversationRouter.delete("/:id", async (req: any, res) => {
  await prisma.conversation.delete({ where: { id: req.params.id } });

  res.json({ message: "Conversation and messages deleted." });
});
