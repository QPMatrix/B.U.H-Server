import type { Request, Response } from "express";
import prisma from "@lib/prisma";

export const createAppointment = async (req: Request, res: Response) => {
  const { userId, workerId, serviceId, appointmentTime } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        workerId,
        serviceId,
        appointmentTime: new Date(appointmentTime),
      },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Appointment created successfully",
        appointment,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { user: true, worker: true, service: true },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { user: true, worker: true, service: true },
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, workerId, serviceId, appointmentTime, status } = req.body;

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        userId,
        workerId,
        serviceId,
        appointmentTime: appointmentTime
          ? new Date(appointmentTime)
          : undefined,
        status,
      },
    });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await prisma.appointment.delete({ where: { id } });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};
