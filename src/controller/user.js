import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in the details" });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // password hash value
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("New user saving:", newUser);
    return res.status(200).send({
      success: true,
      message: "User has been registered",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Problem in API",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "all filed are mandetory",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "invalid user",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "invalid password",
      });
    }
// token generate------------
    const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:"180d",
    })
    return res.status(200).send({
      success: true,
      message: "login successfull",
      token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        }  , //user detail show after successfull
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "problem in login api",
    });
  }
};

