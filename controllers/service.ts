import type { Request, Response } from "express";
import prisma from "@lib/prisma";

export const createService = async (req: Request, res: Response) => {
  const { name, description, price, duration } = req.body;

  try {
    const service = await prisma.service.create({
      data: { name, description, price, duration },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Service created successfully",
        service,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;

  try {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { name, description, price, duration },
    });

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await prisma.service.delete({ where: { id } });

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
