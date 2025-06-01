import express from "express";

import { authMiddleware } from "./middleware";
import { activeLlamaSessions } from "./llama";

export const sessionRouter = express.Router();
sessionRouter.use(authMiddleware);

sessionRouter.get("/", (req, res) => {
  res.json(Array.from(activeLlamaSessions.keys()));
});

sessionRouter.delete("/:key", (req, res) => {
  const key = req.params.key;
  const sessionEntry = activeLlamaSessions.get(key);
  if (sessionEntry) {
    sessionEntry.context.dispose();
    sessionEntry.model.dispose();
    activeLlamaSessions.delete(key);
    res.json({ message: "Session deleted." });
  } else {
    res.status(404).json({ error: "Session not found." });
  }
});
