const express = require("express");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Aunthenticate = require("../middlewares/Authenticate");
const Router = express.Router();
const User = require("../Modals/UserSchema");


Router.get("/", (req, res) => {
  res.send("hello world !!!!!!!");
});

Router.get("/user", Aunthenticate, (req, res) => {
  if (req.query.isActive) {
    const isActive = req.query.isActive === "true";
    const filteredTodos = req.user.todos.filter(
      (todo) => todo.isActive === isActive
    );
    req.user.todos = filteredTodos;
  }
  res.json(req.user);
});

Router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  const isUser = await User.findOne({ email: req.body.email });
  if (isUser) return res.status(400).send({ message: "user Alredy exist" });
  try {
    if (user) {
      await user.save();
      res.status(200).send("user saved");
    } else {
      res.status(400).send("Invalid details!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

Router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).send("enter email & password!");
    }
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const accessToken = await user.genAuthToken();
        res.json(user);
      } else res.status(403).send("invalid credentials!");
    } else res.status(404).send("signup first !");
  } catch (error) {
    console.log("pwd", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = Router;
