import express from "express";
import { getHashedPassword, matchPassword } from "./utils";
import { getPrismaInstance } from "./prisma";
import { authMiddleware } from "./middleware";
import jwt from "jsonwebtoken";

const prisma = getPrismaInstance();

// User Router
export const userRouter = express.Router();
userRouter.post("/register", async (req, res): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email and Password required.");
  try {
    const hashedPassword = getHashedPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return res.status(201).json({ message: "User registered.", user });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed." });
  }
});

userRouter.post("/login", async (req, res): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email and Password required.");
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !matchPassword(user.password, password))
      return res.status(401).json({ error: "Invalid credentials." });
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: "7d",
    });
    res.status(200).json({ message: "Login successful.", user, token });
  } catch {
    res.status(500).json({ error: "Login failed." });
  }
});

userRouter.post("/logout", authMiddleware, (req, res): any => {
  // Invalidate the JWT token on the client side

  res.status(200).json({ message: "Logged out successfully." });
});

// CRUD for user
userRouter.get("/", authMiddleware, async (req, res): Promise<any> => {
  const users = await prisma.user.findMany();
  res.json(users);
});

userRouter.get("/:id", authMiddleware, async (req, res): Promise<any> => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json(user);
});

userRouter.put("/:id", authMiddleware, async (req, res): Promise<any> => {
  const { email, password, name } = req.body;
  const hashedPassword = getHashedPassword(password);
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { email, password: hashedPassword, name },
  });
  res.json(user);
});
userRouter.delete("/:id", authMiddleware, async (req, res): Promise<any> => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "User deleted." });
});
