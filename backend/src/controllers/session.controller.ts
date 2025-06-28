import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { sessionValidationSchema } from "../validations/session.schema.js";
import Session from "../models/session.model.js";
import Event from "../models/event.model.js";

export const addSessionForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = sessionValidationSchema.parse(req.body);
    const { event, title, description, startTime, endTime, venueRoom } =
      parsedData;

    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      return next(errorHandler(404, "Event not found"));
    }

    const session = new Session({
      event,
      title,
      description,
      startTime,
      endTime,
      venueRoom,
    });
    await session.save();
    res.status(201).json({
      success: true,
      message: "Session added successfully",
      data: session,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getSessionForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const session = await Session.find({ event: eventId }).populate("event");
    if (!session) {
      next(errorHandler(404, "Session not found"));
    }
    res.status(200).json({
      success: true,
      message: "Session found successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSessionForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const parsedData = sessionValidationSchema.parse(req.body);
    const { event, title, description, startTime, endTime, venueRoom } =
      parsedData;

    const sesion = await Session.findById(id);
    if (!sesion) {
      next(errorHandler(404, "Session not found"));
    }
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      {
        $set: {
          event,
          title,
          description,
          startTime,
          endTime,
          venueRoom,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: updatedSession,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const deleteSessionForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      next(errorHandler(404, "Session not found"));
    }
    await Session.findByIdAndUpdate(id);
    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
