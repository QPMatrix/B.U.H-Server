import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "@lib/prisma";
const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).send("Unauthorized request");
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
      return res.status(403).send("No refresh token found");
    }
    // Compare the hashed token in the database with the provided token
    const isValid = await Bun.password.verify(
      refreshToken,
      user.refreshToken,
      "bcrypt"
    );
    if (!isValid) return res.status(403).send("Invalid refresh token");
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );
    const newHashedRefreshToken = await Bun.password.hash(
      newRefreshToken,
      "bcrypt"
    );
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        refreshToken: newHashedRefreshToken,
        refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
export default handleRefreshToken;
