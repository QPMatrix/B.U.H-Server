import type { Request, Response } from "express";
import prisma from "@lib/prisma";

export const createSchedule = async (req: Request, res: Response) => {
  const { workerId, dayOfWeek, startTime, endTime } = req.body;

  try {
    const schedule = await prisma.schedule.create({
      data: {
        workerId,
        dayOfWeek,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Schedule created successfully",
        schedule,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: { worker: true },
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: { worker: true },
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { workerId, dayOfWeek, startTime, endTime } = req.body;

  try {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        workerId,
        dayOfWeek,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await prisma.schedule.delete({ where: { id } });

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
