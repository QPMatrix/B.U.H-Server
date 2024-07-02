import express from "express";
import {
  createSchedule,
  getScheduleById,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "@controllers/schedule";
import authenticateToken from "@middleware/authenticate-token";

const router = express.Router();

router.post("/", authenticateToken, createSchedule);
router.get("/:id", authenticateToken, getScheduleById);
router.get("/", authenticateToken, getAllSchedules);
router.put("/:id", authenticateToken, updateSchedule);
router.delete("/:id", authenticateToken, deleteSchedule);

export default router;
