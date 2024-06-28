import authRouter from "@routes/auth";
import userRouter from "@routes/user";
import express from "express";

export const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
