import Booking from "../models/Booking.js";
import Post from "../models/Post.js";
// import Stripe from "stripe";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
// import { sendBookingEmail } from "../utils/sendEmail.js";

export const searchBookings = async (req, res) => {
  try {
    const { keyword } = req.params;

    // Split the keyword into individual words
    const words = keyword.split(" ");

    // Build the query to match any word in the description
    const results = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        {
          description: {
            $regex: words.join("|"), // Matches any of the words
            $options: "i", // Case-insensitive
          },
        },
      ],
    }).select("title hotelLocation images description");

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
export const updateAvailability = async (req, res) => {
  const { postId, isAvailable } = req.body;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid postId format." });
  }

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { isAvailable },
      { new: true },
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createBooking = async (req, res) => {
  try {
    const { token, postId, bookingDate, transactionId, amount } = req.body;

    if (!token || !postId || !bookingDate || !transactionId || amount == null) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: token, postId, bookingDate, transactionId.",
      });
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const userId = decoded.id;
    const userExists = await User.findById(userId);

    console.log("Decoded userId:", userId);
    console.log("User found:", userExists);
    console.log("USER EMAIL:", userExists?.email);
    console.log("USER NAME:", userExists?.name);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // FIND HOTEL
    // ==========================================

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // ==========================================
    // CREATE BOOKING
    // ==========================================

    const booking = new Booking({
      user: userId,
      post: postId,
      bookingDate,
      transactionId,
      paymentStatus: "paid",
      amount: Number(amount),
      status: "confirmed",
    });

    const savedBooking = await booking.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: savedBooking,
      isAvailable: false,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      // .populate("user post", "name title"); // Populate user and post details if needed
      .populate("user", "name")
      .populate("post", "title");

    return res.status(200).json({
      success: true,
      message: "All Bookings List",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.post) {
      const updatedPost = await Post.findByIdAndUpdate(
        booking.post,
        { $set: { isAvailable: true } },
        { new: true },
      );

      console.log("POST AFTER DELETE:", updatedPost);
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const checkoutBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1. Booking find karo
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // 2. Agar already checkout ho chuki hai
    if (booking.status === "checked-out") {
      return res.status(400).json({
        success: false,
        message: "Booking is already checked out",
      });
    }

    // 3. Booking status update karo
    booking.status = "checked-out";
    booking.checkoutDate = new Date();

    await booking.save();

    // 4. Hotel ko available karo
    if (booking.post) {
      const updatedPost = await Post.findByIdAndUpdate(
        booking.post,
        { $set: { isAvailable: true } },
        { new: true },
      );

      console.log("POST AFTER CHECKOUT:", updatedPost);
    }

    return res.status(200).json({
      success: true,
      message: "Checkout completed successfully",
      booking,
    });
  } catch (error) {
    console.error("Error during checkout:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getUserBookings = async (req, res) => {
  try {
  const userId = req.user?._id || req.user?.id;
    const bookings = await Booking.find({user: userId })
      .populate("user", "name")
      .populate("post", "title");

    return res.status(200).json({
      success: true,
      message: "User Bookings List", 
      bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
      error: error.message,
    });
  }
};


// export const cancelBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     // 1. Booking find karein
//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking nahi mili." });
//     }

//     if (booking.status === "CANCELLED") {
//       return res.status(400).json({ message: "Yeh booking pehle se cancelled hai." });
//     }

//     // 2. Booking status ko CANCELLED karein
//     booking.status = "cancelled";
//     await booking.save();

   

//     res.status(200).json({ message: "Booking successfully cancel ho gayi hai aur room available kar diya gaya hai." });
//   } 
//   catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// const stripe = new Stripe(
//   "sk_test_51NmvjYSJMmMS2PKYOt73HhhQ8a7gIiqlnrz4ZirSQWRtZi8HmoydPtDEO6D4Q2WPQScbgZWbDBP24hvXzfaMPDAN00H63tvSXI"
// );
// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount, currency, description, customerName, customerAddress } =
//       req.body;

//     if (
//       !amount ||
//       !currency ||
//       !description ||
//       !customerName ||
//       !customerAddress
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Amount, currency, description, customer name, and address are required",
//       });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       payment_method_types: ["card"],
//       description,
//       shipping: {
//         name: customerName,
//         address: {
//           line1: customerAddress.line1,
//           city: customerAddress.city,
//           state: customerAddress.state,
//           postal_code: customerAddress.postalCode,
//           country: customerAddress.country,
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create payment intent",
//       error: error.message,
//     });
//   }
// };
