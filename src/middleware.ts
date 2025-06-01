import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided." });
    return;
  }
  const secret = process.env.JWT_SECRET || "default_secret";
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }
    (req as any).jwt = decoded;
    next();
  });
}
