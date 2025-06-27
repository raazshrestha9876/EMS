import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import Event from "../models/event.model.js";
import { eventValidationSchema } from "../validations/event.schema.js";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";
import Venue from "../models/venue.model.js";

export const addEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = eventValidationSchema.parse(req.body);
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      venue,
      capacity,
      image,
    } = parsedData;

    const organizer = (req as AuthenticatedRequest).user?.id;

    const existingVenue = await Venue.findById(venue);
    if (!existingVenue) {
      return next(errorHandler(404, "Venue not found"));
    }

    

    const event = new Event({
      title,
      description,
      category,
      startDate,
      endDate,
      organizer,
      venue,
      capacity,
      image,
    });
    await event.save();
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await Event.find()
      .populate("organizer")
      .populate("venue")
      .populate("sessions");
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const approveEventByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { approved }: { approved: boolean } = req.body;
    const event = await Event.findById(id);
    if (!event) return next(errorHandler(404, "Event not found"));

    event.approved = approved;
    await event.save();
    res.status(200).json({
      success: true,
      message: "Event approved successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
