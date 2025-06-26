import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { sessionValidationSchema } from "../validations/session.schema.js";
import Session from "../models/session.model.js";

export const addSessionForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = sessionValidationSchema.parse(req.body);
    const {event, title, description, startTime, endTime, venueRoom } = parsedData;

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
    const session = await Session.find({ event: eventId }).populate('event');
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
