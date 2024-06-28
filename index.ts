import credentials from "@middleware/credentials";
import { logger } from "@middleware/logger";
import authRouter from "@routes/auth";
import userRouter from "@routes/user";
import express from "express";
import cors from "cors";
import corsOptions from "@config/cors-option";
import cookieParser from "cookie-parser";
import errorHandler from "@middleware/error-handler";
import refreshRouter from "@routes/refresh-token";

//? create an express application
export const app = express();
const port = process.env.PORT || 8080;

//? custom middleware logger
app.use(logger);

//? Handle options credentials check - before CORS!
//? and fetch cookies credentials requirement
app.use(credentials);

//? Cross Origin Resource Sharing
app.use(cors(corsOptions));

//? built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//? built-in middleware for json
app.use(express.json());

//?middleware for cookies
app.use(cookieParser());

//? Routes
app.use("/auth", authRouter);
app.use("/refresh-token", refreshRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
//?Error handling middleware
app.use(errorHandler);
