import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { performerValidationSchema } from "../validations/performer.schema.js";
import Performer from "../models/performer.model.js";
import Event from "../models/event.model.js";
import Session from "../models/session.model.js";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";

export const addPerformer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = performerValidationSchema.parse(req.body);
    const { name, bio, image, price, event, session, type, phone } = parsedData;

    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      return next(errorHandler(404, "Event not found"));
    }

    if (session) {
      const existingSession = await Session.findById(session);
      if (!existingSession) {
        return next(errorHandler(404, "Session not found"));
      }
      if (existingSession.event.toString() !== event) {
        return next(errorHandler(404, "Session does not belong to the event"));
      }
    }

    const existingPerformer = await Performer.findOne({ name });
    if (existingPerformer) {
      return next(errorHandler(400, "Performer already exists"));
    }

    const performer = new Performer({
      name,
      bio,
      image,
      price,
      event,
      session,
      type,
      phone,
    });
    await performer.save();
    res.status(201).json({
      success: true,
      message: "Performer added successfully",
      data: performer,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getPerformersForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const user = (req as AuthenticatedRequest)?.user;

    const event = await Event.findById(eventId);
    if (!event) {
      return next(errorHandler(404, "Event not found"));
    }

    if (user?.role === "attendee") {
      return next(
        errorHandler(403, "Attendees are not authorized to view performers")
      );
    }

    if (user?.role === "organizer" && event.organizer.toString() !== user.id) {
      return next(
        errorHandler(
          403,
          "You are not authorizied to view performer of this event"
        )
      );
    }

    const performers = await Performer.find({ event: eventId })
      .populate("event")
      .populate("session");
    res.status(200).json({
      success: true,
      data: performers,
    });
  } catch (error) {
    next(error);
  }
};
