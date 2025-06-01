import express from "express";
import cors from "cors";
import { userRouter } from "./users";
import { conversationRouter } from "./conversations";
import { messageRouter } from "./messages";
import { sessionRouter } from "./sessions";
import { chatRouter } from "./chat";

const app = express();
const port = 3101;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// --- Mount Routers ---
app.use("/api/users", userRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/chat", chatRouter);

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
