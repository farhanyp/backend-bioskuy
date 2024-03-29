import express from "express";
import cors from "cors";
import UserRouter from "../api/v1/user/route.js";
import MovieRouter from "../api/v1/movie/route.js";
import StudioRouter from "../api/v1/studio/route.js";
import ShowtimeRouter from "../api/v1/showtime/route.js";
import SeatBookingRouter from "../api/v1/seatBooking/route.js";
import PaymentRouter from "../api/v1/payment/route.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const app = express();
app.use(express.json());
app.use(cors());

app.use(UserRouter);
app.use(MovieRouter);
app.use(StudioRouter);
app.use(ShowtimeRouter);
app.use(SeatBookingRouter);
app.use(PaymentRouter);

app.use(errorMiddleware);