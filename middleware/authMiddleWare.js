import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const isAuthorized = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ message: "Invalid Authorization, token faileds" });
    }
  }

  if (!token) {
    res.status(401).send({ message: "User Not Authorized" });
  }
};
export { isAuthorized };
