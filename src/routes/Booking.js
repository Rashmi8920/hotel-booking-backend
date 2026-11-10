import express from "express";
import {
  createBooking,
  // createPaymentIntent,
  checkoutBooking,
  searchBookings,
  getBookings,deleteBooking,
  updateAvailability,
  getUserBookings,
  // cancelBooking,
} from "../controller/Booking.js";
import { requireSignIn } from "../middleware/Auth.js";
const router = express.Router();

router.patch("/update-availability", updateAvailability);
router.post("/create-booking", createBooking);
router.get("/get-all-bookings", getBookings);
router.get("/get-user-bookings",requireSignIn,getUserBookings);
router.delete("/delete-booking/:bookingId", deleteBooking);
router.get("/search/:keyword", searchBookings);
router.put( "/checkout/:bookingId", checkoutBooking);
// router.post("/create-payment-intent", createPaymentIntent);


export default router;
