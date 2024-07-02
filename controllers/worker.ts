import type { Request, Response } from "express";
import prisma from "@lib/prisma";

export const createWorker = async (req: Request, res: Response) => {
  const { userId, services, schedules } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const worker = await prisma.worker.create({
      data: {
        userId,
        services: services
          ? {
              connect: services.map((serviceId: string) => ({ id: serviceId })),
            }
          : undefined,
        schedules: schedules
          ? {
              create: schedules,
            }
          : undefined,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Worker created successfully", worker });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getWorkerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: { user: true, services: true, schedules: true },
    });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await prisma.worker.findMany({
      include: { user: true, services: true, schedules: true },
    });

    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const updateWorker = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { services, schedules } = req.body;

  try {
    const worker = await prisma.worker.findUnique({ where: { id } });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const updatedWorker = await prisma.worker.update({
      where: { id },
      data: {
        services: services
          ? {
              connect: services.map((serviceId: string) => ({ id: serviceId })),
            }
          : undefined,
        schedules: schedules
          ? {
              create: schedules,
            }
          : undefined,
      },
      include: { user: true, services: true, schedules: true },
    });

    res.status(200).json(updatedWorker);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const deleteWorker = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const worker = await prisma.worker.findUnique({ where: { id } });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    await prisma.worker.delete({ where: { id } });

    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
