import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hotelLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type:mongoose.Schema.Types.ObjectId,
    // type:String,
    required: true,
    ref: "Category",
  },
  images: {
    type: [String],
    required: true,
    validate: [arraylimit, "you must provide at least 3 images"],
  },
  guest: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 100,
    // max: 500,
  },
  nearArea: {
    type: [String],
    required: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  facilities:{
    type: [String],
    required: true,
  },
  isAvailable: {
    type: Boolean,
    // required: true,
    default: true,
  },
});

function arraylimit(val){
    return val.length===3
}

export default mongoose.model("Post",postSchema);
