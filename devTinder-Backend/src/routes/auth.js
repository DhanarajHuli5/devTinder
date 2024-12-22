const express = require("express");
const authRouter = express.Router();
const { validateSignUpData} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt"); 
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
authRouter.post("/signup", async (req, res) => {
  // creating a new instance of User model
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(500).send("ERROR " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid emailId");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //JWT token create
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login successfull !!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout",userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId
    };
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ 
        success: true, 
        message: "Logout successful", 
        userData: userResponse 
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = authRouter;
