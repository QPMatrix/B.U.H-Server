import { prisma } from "@lib/prisma";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
export const register = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send("No data in request body");
  }

  const { email, firstName, lastName, phone, password, role, locations } =
    req.body;

  try {
    // Check if the user already exists using OR condition to check either email or phone
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (userExists) {
      return res
        .status(409)
        .send("User already exists with given email or phone");
    }

    // Hashing the password using bcrypt with a salt

    const hashedPassword = await Bun.password.hash(password, "bcrypt");

    // Creating a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        password: hashedPassword,
        role,
        locations: {
          create: locations,
        },
      },
    });
    //TODO: Send a Verication  email or sms  to the user
    // Return the result
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id, // Ensure sensitive info like password is not sent back
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("Registration failed");
  }
};
export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send("No data in request body");
  }

  const { email, phone, password } = req.body;

  try {
    // Determine the key to use for finding the user (either email or phone)
    const key = email ? { email } : phone ? { phone } : null;
    if (!key) {
      return res.status(400).send("Email or Phone is required");
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: key,
    });

    if (!user) {
      return res.status(404).send("User does not exist");
    }

    // Verify password
    const isMatch = await Bun.password.verify(
      password,
      user.password,
      "bcrypt"
    );
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // Hash the refresh token before storing it in the database
    const hashedRefreshToken = await Bun.password.hash(refreshToken, "bcrypt");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
        refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Send the tokens to the client
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Login failed");
  }
};
export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204);
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (typeof decoded !== "object" || !decoded.userId) {
      return res.status(403).send("Invalid refresh token");
    }
    // Retrieve the user and their hashed refresh token from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { refreshToken: true },
    });
    if (!user || !user.refreshToken) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.status(204).send("No refresh token found");
    }
    // Compare the hashed token in the database with the provided token
    const isValid = await Bun.password.verify(
      refreshToken,
      user.refreshToken,
      "bcrypt"
    );
    if (!isValid) return res.status(403).send("Invalid refresh token");
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        refreshToken: null,
        refreshTokenExpires: null,
      },
    });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(204).send("Logged out successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
