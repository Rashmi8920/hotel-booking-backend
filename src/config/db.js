import mongoose from "mongoose";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config(); // .env file load karne ke liye

const url = process.env.MONGODB_URI;
var a = mongoose.connect(url);
const db = mongoose.connection;
db.on("open", err => {
  if (err) {
    console.log("mongodn not connect");
  }
  console.log("connected successfull");
});

export default db;
