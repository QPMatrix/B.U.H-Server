import { prisma } from "@lib/prisma";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  //!Check if the body has all the required fields
  if (!req.body) {
    return res.status(400).send("No data in request body");
  }
  //? Destructure the required fields from the request body
  const { email, firstName, lastName, phone, password, role, locations } =
    req.body;
  try {
    //! Check if the user already exists
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        phone: phone,
      },
    });
    if (user) {
      return res.status(400).send("User already exists");
    }
    //? If the user does not exist, proceed to create a new user
    //! Hashing the password
    const hashedPassword = await Bun.password.hash(password, "bcrypt");
    //! Create a new user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        password: hashedPassword,
        role: role,
        locations: {
          create: locations,
        },
      },
    });
    if (!newUser) {
      return res.status(400).send("User registration failed");
    }
    //TODO: Send an Verification email/Phone to the user
    return res
      .status(201)
      .send("User registered successfully")
      .json(newUser.id);
  } catch (error) {
    res.status(500).send("Registration failed");
  }
};