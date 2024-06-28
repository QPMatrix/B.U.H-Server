import { Router } from "express";
import { login, logout, register } from "../controller/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
export default authRouter;
