import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import venueRoute from "./routes/venue.routes.js";
import eventRoute from "./routes/event.routes.js";
import sessionRoute from "./routes/session.routes.js"

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/venue", venueRoute);
app.use("/api/event", eventRoute);
app.use("/api/session", sessionRoute);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
