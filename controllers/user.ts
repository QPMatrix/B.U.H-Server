import type { Request, Response } from "express";
import prisma from "@lib/prisma";
import bcrypt from "bcryptjs";

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { location: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { location: true },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, phone, firstName, lastName, password, location } = req.body;

  try {
    // Find the user to update
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password if provided
    let hashedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update user details
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        phone,
        firstName,
        lastName,
        password: hashedPassword,
        location: location
          ? {
              update: {
                address: location.address,
                city: location.city,
                state: location.state,
                country: location.country,
                zipCode: location.zipCode,
              },
            }
          : undefined,
      },
      include: { location: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
