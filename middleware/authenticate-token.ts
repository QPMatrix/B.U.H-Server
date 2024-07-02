import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token not found" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = payload; // Attach payload to request object
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired access token" });
  }
};

export default authenticateToken;
