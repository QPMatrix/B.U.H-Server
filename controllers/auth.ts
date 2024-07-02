import prisma from "@lib/prisma";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, phone, firstName, role, lastName, password, location } =
      req.body;

    // Check if the user already exists
    const isExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });
    if (isExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        phone: phone,
        firstName: firstName,
        role: role,
        lastName: lastName,
        password: hashedPassword,
        location: location
          ? {
              create: {
                address: location.address,
                city: location.city,
                state: location.state,
                country: location.country,
                zipCode: location.zipCode,
              },
            }
          : undefined,
      },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

const generateAccessToken = (user: { id: string; role: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m", // Access token expires in 15 minutes
    }
  );
};

const generateRefreshToken = (user: { id: string; role: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d", // Refresh token expires in 7 days
    }
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  try {
    const key = email || phone;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: key }, { phone: key }],
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      path: "/api/auth/refresh-token", // Path where the cookie is accessible
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send access token and user details
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
