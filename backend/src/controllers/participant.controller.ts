import { Request, Response, NextFunction } from "express";
import { participantValidationSchema } from "../validations/participant.schema.js";
import Participant, { IParticipant } from "../models/participant.model.js";
import Event from "../models/event.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import { ZodError } from "zod";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";

export const addParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = participantValidationSchema.parse(req.body);
    const {
      event,
      user, // optional
      type,
      name,
      phone,
      address,
      category,
      role,
      approved,
      assigned,
    } = parsedData;

    // Check if event exists
    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      return next(errorHandler(404, "Event not found"));
    }

    // If user is provided, verify user exists and is attendee
    if (user) {
      const existingUser = await User.findOne({ _id: user, role: "attendee" });
      if (!existingUser) {
        return next(errorHandler(404, "User not found or not an attendee"));
      }

      // Check for existing participant for this user and event
      const existingParticipant = await Participant.findOne({ user, event });
      if (existingParticipant) {
        return next(
          errorHandler(400, "Participant already exists for this event")
        );
      }
    } else {
      // For public users (no user id), check for duplicates by phone + event (optional)
      const existingParticipant = await Participant.findOne({ phone, event });
      if (existingParticipant) {
        return next(
          errorHandler(
            400,
            "Participant with this phone already exists for this event"
          )
        );
      }
    }
    const participantData: {
      event: string;
      user?: string;
      name: string;
      type: string;
      phone: string;
      address: string;
      category?: string;
      role?: string;
      approved?: boolean;
      assigned?: boolean;
    } = {
      event,
      user, // optional
      type,
      name,
      phone,
      address,
      approved,
    };

    if (type === "vendor") {
      participantData.category = category;
    }
    if (type === "volunteer") {
      participantData.role = role;
      participantData.assigned = assigned;
    }
    // Create participant with or without user field
    const participant = new Participant(participantData);
    await participant.save();

    //clean output
    const responseData = participant.toObject();
    if (type === "vendor") {
      delete responseData.role;
      delete responseData.assigned;
    } else if (type === "volunteer") {
      delete responseData.category;
    }
    
    res.status(201).json({
      success: true,
      message: "Participant added successfully",
      data: responseData,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getParticipantForEvent = async (
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

    if (user?.role === "organizer" && event.organizer.toString() !== user.id) {
      return next(errorHandler(403, "You are not the organizer of this event"));
    }

    let participants;

    if (user?.role === "admin") {
      participants = await Participant.find({ event: eventId }).populate("event");
    } else if (user?.role === "organizer") {
      participants = await Participant.find({ event: eventId }).populate("event");
    } else if (user?.role === "attendee") {
      participants = await Participant.find({ event: eventId, user: user.id }).populate("event");
    }

    res.status(200).json({
      success: true,
      data: participants,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(errorHandler(400, error));
    }
    next(error);
  }
};
