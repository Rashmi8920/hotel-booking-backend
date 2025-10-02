import express from "express";
import { createCategoryController,getAllcategory,updateCategoryController,deleteCategory ,singleCategory} from "../controller/Category.js";
import {isAdmin,requireSignIn} from '../middleware/Auth.js'

const app =express.Router();

app.post("/create-category",createCategoryController)
app.get("/get-category",getAllcategory);
app.put("/update-category/:id",
    // isAdmin,requireSignIn,
    updateCategoryController)
app.delete("/delete-category/:id",deleteCategory)
app.delete("/single-category/:slug",singleCategory)

export default app;