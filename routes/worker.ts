import express from "express";
import {
  createWorker,
  getWorkerById,
  getAllWorkers,
  updateWorker,
  deleteWorker,
} from "@controllers/worker";
import authenticateToken from "@middleware/authenticate-token";

const router = express.Router();

router.post("/", authenticateToken, createWorker);
router.get("/:id", authenticateToken, getWorkerById);
router.get("/", authenticateToken, getAllWorkers);
router.put("/:id", authenticateToken, updateWorker);
router.delete("/:id", authenticateToken, deleteWorker);

export default router;
