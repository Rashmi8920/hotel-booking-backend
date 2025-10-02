import jwt from "jsonwebtoken";
import User from "../models/User.js";

// product route based on token
// export const requireSignIn = async (req, res, next) => {
//   try {
    
//     const decode = jwt.verify(
//       req.headers,
//       authorization,
//       process.env.JWT_SECRET
//     );
//     req.user = decode;
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// };

export const requireSignIn = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
 console.log("authorization", bearerToken)
    if (!bearerToken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    // console.log("Decoded user:", decoded);

    next();
  } catch (err) {
    console.log("JWT Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};



// admin middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user?.role !== "admin") {
      return res.status(401).send("unauthorized user");
    } else {
      next();
    }
  } catch (err) {
    console.log("error in admin middleware",err);
    res.status(401).send({
      success:false,
      message:"error in admin  middleare",
    })
  }
};
