import express from "express";
import {
  createBooking,
  // createPaymentIntent,
  // searchBookings,
  getBookings,deleteBooking,
  updateAvailability,
} from "../controller/Booking.js";
const router = express.Router();

router.patch("/update-availability", updateAvailability);
router.post("/create-booking", createBooking);
router.get("/get-all-bookings", getBookings);
router.delete("/delete-booking/:bookingId", deleteBooking);
// router.get("/search/:keyword", searchBookings);
// router.post("/create-payment-intent", createPaymentIntent);


export default router;
