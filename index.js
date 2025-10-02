import  express from "express";
import cors from"cors";
import morgan from "morgan";
import  dotenv from "dotenv";
import bodyPareser from 'body-parser';
// import db from './src/config/db.js'
import fileUpload from 'express-fileupload';
import './src/config/db.js';

// route import
import authRoutes from './src/routes/User.js';
import postRoutes from './src/routes/Post.js';
import categoryRoutes from './src/routes/Category.js'
import bookingRoutes from './src/routes/Booking.js'
// import { createCategoryController } from "./src/controller/Category.js";


const app=express()
dotenv.config();

app.use(cors());
app.use (express.json());
app.use(morgan('dev'));
app.use(fileUpload({ useTempFiles: true }));


const PORT= process.env.PORT||5000;     

app.get("/",(req,res)=>{
    // console.log("welcome to hhg api")
        res.send("Welcome to hhg API");

});
// Routes
app.use('/auth/api', authRoutes);
app.use('/api/post',postRoutes);
app.use("/api/category",categoryRoutes)
app.use("/api/booking",bookingRoutes)


app.listen(PORT,()=>{
    console.log(`server is run on ${PORT}`);
});