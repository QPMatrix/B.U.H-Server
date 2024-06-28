import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized request"); // Unauthorized

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_JWT_SECRET!, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden
    if (!decoded) return res.sendStatus(403);

    const userId = typeof decoded === "object" ? decoded.id : undefined;
    if (!userId) return res.sendStatus(403); // Handle missing userId

    req.userId = userId;
    next();
  });
};
