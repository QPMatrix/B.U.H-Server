import { logEvents } from "./logger";
import type { Request, Response, NextFunction } from "express";
import type { ErrorRequestHandler } from "express"; // Importing ErrorRequestHandler type

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);

  res.status(500).send(err.message);
};

export default errorHandler;
