import { Request, Response, NextFunction } from "express";
import Venue from "../models/venue.model.js";
import { venueValidationSchema } from "../validations/venue.schema.js";
import { ZodError } from "zod";
import { errorHandler } from "../utils/errorHandler.js";

export const addVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = venueValidationSchema.parse(req.body);
    const { name, address, city, country, postalCode, state, location } =
      parsedData;

    const venue = new Venue({
      name,
      address,
      city,
      country,
      postalCode,
      state,
      location,
    });
    await venue.save();
    res.status(201).json({
      success: true,
      message: "Venue added successfully",
      data: venue,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      next(errorHandler(400, error));
    }
    next(error);
  }
};

export const getVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const venues = await Venue.find();
    res.status(200).json({
      success: true,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

