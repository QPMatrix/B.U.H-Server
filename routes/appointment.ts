import express from "express";
import {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "@controllers/appointment";
import authenticateToken from "@middleware/authenticate-token";

const router = express.Router();

router.post("/", authenticateToken, createAppointment);
router.get("/:id", authenticateToken, getAppointmentById);
router.get("/", authenticateToken, getAllAppointments);
router.put("/:id", authenticateToken, updateAppointment);
router.delete("/:id", authenticateToken, deleteAppointment);

export default router;
