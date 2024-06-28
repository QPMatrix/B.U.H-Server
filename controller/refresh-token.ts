import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "@lib/prisma";

const handleRefreshToken = async (req: Request, res: Response) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.status(401).send("Unauthorized request");

  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (typeof decoded !== "object" || !decoded.userId) {
      return res.status(403).send("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { refreshToken: true },
    });

    if (!user || !user.refreshToken)
      return res.status(403).send("No refresh token found");

    const isValid = await Bun.password.verify(
      refreshToken,
      user.refreshToken,
      "bcrypt"
    );
    if (!isValid) return res.status(403).send("Invalid refresh token");

    // Rotate the refresh token
    const newRefreshToken = jwt.sign(
      { id: decoded.userId },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );
    const newHashedRefreshToken = await Bun.password.hash(
      newRefreshToken,
      "bcrypt"
    );

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { refreshToken: newHashedRefreshToken },
    });

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const newAccessToken = jwt.sign(
      { id: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
export default handleRefreshToken;
