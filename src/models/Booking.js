import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

  bookingDate: {
    type: Date,
    required: true,
  },

  checkoutDate: {
    type: Date,
  },

  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "completed",
      "cancelled",
      "confirmed",
      "checked-out",
    ],
    default: "confirmed",
  },

  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },

  transactionId: {
    type: String,
  },
});

export default mongoose.model("Booking", bookingSchema);