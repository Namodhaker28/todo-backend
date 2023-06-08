const jwt = require("jsonwebtoken");
const User = require("../Modals/UserSchema");
const { request } = require("express");

const Authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(400).send("Invalid AccessToken");
    next();
  }
  const tokenUser = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findById(tokenUser._id).populate("todos").exec();
  req.user = user;
  next();
};
module.exports = Authenticate;
