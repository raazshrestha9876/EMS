import { AuthenticatedRequest } from "../types/authenticatedRequest.js";
import Ticket from "../models/ticket.model.js";
import Booking from "../models/booking.model.js";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";
import { Request, Response, NextFunction } from "express";

export const eventBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticket, quantity, paymentMethod, paymentStatus } = req.body;
    const user = (req as AuthenticatedRequest)?.user;

    const existingTicket = await Ticket.findById(ticket);
    if (!existingTicket) {
      return next(errorHandler(404, "Ticket not found"));
    }
    //check ticket availability
    const totalBooked = await Booking.aggregate([
      { $match: { ticket: existingTicket._id } },
      {
        $group: {
          _id: null,
          totalBooked: { $sum: "$quantity" },
        },
      },
    ]);
    const bookCount = totalBooked[0]?.totalBooked || 0;
    const remanining = existingTicket.maxTicket - bookCount;

    if (quantity > remanining) {
      return next(errorHandler(400, `only ${remanining} tickets available`));
    }
    const booking = new Booking({
      ticket,
      user: user?.id,
      quantity,
      paymentMethod,
      paymentStatus,
    });

    await booking.save();

    const responseData = {
      booking: booking,
      ticket: existingTicket,
      quantity: booking.quantity,
    };
    
    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: responseData,
    });

  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};
