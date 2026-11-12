import  express from "express";
import cors from"cors";
import morgan from "morgan";
import  dotenv from "dotenv";
import bodyPareser from 'body-parser';
import fileUpload from 'express-fileupload';
import './src/config/db.js';

// route import
import authRoutes from './src/routes/User.js';
import postRoutes from './src/routes/Post.js';
import categoryRoutes from './src/routes/Category.js'
import bookingRoutes from './src/routes/Booking.js'

const app=express()
dotenv.config();

// OR allow only your frontend
app.use(cors({
   origin: [
        "http://localhost:5173", 
        "http://localhost:5174",
        "https://hotel-booking-app-4nue.onrender.com" // Aapka live frontend URL
    ],
      methods: ["GET", "POST", "PATCH", "DELETE","PUT"],
    credentials: true,
}));

app.use (express.json());
app.use(morgan('dev'));
app.use(fileUpload({ useTempFiles: true }));


const PORT= process.env.PORT||5000;     

app.get("/",(req,res)=>{
    console.log("welcome to hhg api")
});

// Routes
app.use('/auth/api', authRoutes);
app.use('/api/post',postRoutes);
app.use("/api/category",categoryRoutes)
app.use("/api/booking",bookingRoutes)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
