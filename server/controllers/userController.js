const express = require("express");
const userModel = require("../model/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN CONTROLLLER:
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json("User not found!");
  }
  console.log("user found", user);
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json("Wrong Credentials!");
  }
  console.log("password found", match);
  if (user && match) {
    const token = generateToken(user._id);
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
      role:user.role,
    };
    res.cookie("token", token).status(200).json(response);
    console.log(response);
  } else {
    res.status(404);
    throw new Error("Invalid credentials!");
  }
});

// REGISTER CONTROLLER:
const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //check for all fields
  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Credentials are missing!");
  }
  //check for user already exist
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return res.status(405).json("Please use unique Email!");
  }
  //username already exists
  const usernameExists = await userModel.findOne({ name });
  if (usernameExists) {
    return res.status(406).json("Username already exists!");
  }
  //create an entry of the user in the database
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hash Password: ", hashedPassword);
  if (hashedPassword) {
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    console.log(`User created: ${savedUser}`);
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role:user.role,
      });
    }
  } else {
    return res.status(400).json("Registration is not successful!");
  }
});

// LOGOUT CONTROLLER:
const logoutController = asyncHandler(async (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
});






const fetchController = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    const userId= data.id;
      try {
      // Fetch the user details from the database using the user ID
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Send the user details as response
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

module.exports = {
  loginController,
  registerController,
  logoutController,
  fetchController,
};
