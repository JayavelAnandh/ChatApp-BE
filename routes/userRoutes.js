import express from "express";
import { generateAuthToken, User } from "../models/userModel.js";
import bcrypt from "bcrypt";

let router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    let newUser = await User.findOne({ email: req.body.email });

    if (newUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    let salt = await bcrypt.genSalt(10);
    let userPassword = req.body.password.toString();
    let hashedPassword = await bcrypt.hash(userPassword, salt);

    newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      pic: req.body.pic,
    }).save();

    let AuthToken = generateAuthToken(newUser._id);

    res.status(200).send({
      authToken: AuthToken,
      userDetails: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const userToLogin = await User.findOne({ email: req.body.email });

    if (!userToLogin) {
      return res
        .status(400)
        .send({ message: "User Not Found With Provided Email Address" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      userToLogin.password
    );

    if (!validPassword) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const authToken = await generateAuthToken(userToLogin._id);
    res.status(200).send({
      authToken: authToken,
      userDetails: userToLogin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

const UserRoutes = router;
export default UserRoutes;
