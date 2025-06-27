import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { ticketValidationSchema } from "../validations/ticket.schema.js";
import Event from "../models/event.model.js";
import Ticket from "../models/ticket.model.js";

export const addTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = ticketValidationSchema.parse(req.body);
    const { event, ticketType, maxTicket, price } = parsedData;

    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      return next(errorHandler(404, "Event not found"));
    }

    const existingTicket = await Ticket.findOne({ event, ticketType });
    if (existingTicket) {
      return next(errorHandler(400, "Ticket already exists for this event"));
    }
    const newTicket = new Ticket({
      event,
      ticketType,
      maxTicket,
      price,
    });
    await newTicket.save();
    res.status(201).json({
      success: true,
      message: "Ticket added successfully",
      data: newTicket,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getTicketByEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const tickets = await Ticket.find({ event: eventId });
    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
