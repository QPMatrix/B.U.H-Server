import handleRefreshToken from "../controller/refresh-token";
import { Router } from "express";

const refreshRouter = Router();
refreshRouter.get("/", handleRefreshToken);
export default refreshRouter;
