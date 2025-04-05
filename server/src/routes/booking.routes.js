import express from 'express';
import { verify } from '../middleware/verify.js';
import { createBooking, getUserBookings, getBookingById, updateBookingStatus, deleteBooking, cancelBooking } from '../controller/booking.controller.js';

const bookingRoutes = express.Router();

bookingRoutes.post("/create", verify, createBooking);
bookingRoutes.get("/user", verify, getUserBookings);
bookingRoutes.get("/:id", verify, getBookingById);
bookingRoutes.put("/status/:id", verify, updateBookingStatus);
bookingRoutes.put("/cancel/:id", verify, cancelBooking);
bookingRoutes.delete("/delete/:id", verify, deleteBooking);

export default bookingRoutes;