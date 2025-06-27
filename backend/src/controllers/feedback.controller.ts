import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { Request, Response, NextFunction } from "express";
import { feedbackValidationSchema } from "../validations/feedback.schema.js";
import { AuthenticatedRequest } from "../types/authenticatedRequest.js";
import Event from "../models/event.model.js";
import Feedback from "../models/Feedback.model.js";

export const addFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = feedbackValidationSchema.parse(req.body);
    const { event, rating, comment } = parsedData;

    const user = (req as AuthenticatedRequest)?.user;

    const existingEvent = await Event.findOne({ _id: event });
    if (!existingEvent) {
      return next(errorHandler(404, "Event not found"));
    }
    const newFeedback = new Feedback({
      user: user?.id,
      event,
      rating,
      comment,
    });
    await newFeedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback added successfully",
      data: newFeedback,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getFeedbackByEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ event: eventId });
    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
