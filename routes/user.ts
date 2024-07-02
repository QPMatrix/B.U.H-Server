import express from "express";
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "@controllers/user";
import authenticateToken from "@middleware/authenticate-token";

const router = express.Router();

router.get("/:id", authenticateToken, getUserById);
router.get("/", authenticateToken, getAllUsers);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
