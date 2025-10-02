import express from "express"
import { registerController,loginController } from "../controller/user.js";
import { isAdmin, requireSignIn } from "../middleware/Auth.js";

const app= express.Router()

app.post('/register',registerController)
app.post('/login',loginController);


// proetcted routes for user auth
app.get("/user-auth", requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

app.get('/is-admin',requireSignIn,(req,res)=>{
  res.status(200).send({ok:true})
})

export default app;