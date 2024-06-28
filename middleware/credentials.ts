import allowedOrigins from "@config/allowed-origin";
import type { NextFunction, Request, Response } from "express";

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

export default credentials;
