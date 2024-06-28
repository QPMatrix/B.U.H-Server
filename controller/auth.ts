import { prisma } from "@lib/prisma";
import type { Request, Response } from "express";
//Register a new user for the System
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
//Login function
export const login = async (req: Request, res: Response) => {
  //!Check if the body has all the required fields
  if (!req.body) {
    return res.status(400).send("No data in request body");
  }
  //? Destructure the required fields from the request body
  const { email, phone, password } = req.body;
  try {
    let user;
    if (!phone) {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } else if (!email) {
      user = await prisma.user.findUnique({
        where: {
          phone: phone,
        },
      });
    } else {
      return res.status(400).send("Email or Phone is required");
    }
    //! Check if the user exists
    if (!user) {
      return res.status(400).send("User does not exist");
    }
    //! Compare the password
    const isMatch = await Bun.password.verify(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Login failed");
  }
};
