import express from "express";
import {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
} from "@controllers/service";
import authenticateToken from "@middleware/authenticate-token";

const router = express.Router();

router.post("/", authenticateToken, createService);
router.get("/:id", authenticateToken, getServiceById);
router.get("/", authenticateToken, getAllServices);
router.put("/:id", authenticateToken, updateService);
router.delete("/:id", authenticateToken, deleteService);

export default router;
