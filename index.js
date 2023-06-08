require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const mongoose = require("mongoose");
const myRouter = require('./routes/AuthRouter.js')
const todoRouter = require('./routes/TodoRouter.js')

app.use("/api/v1",myRouter)
app.use("/api/v1/todo",todoRouter)

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true,
      useUnifiedTopology: true,},
  () => {
    console.log("mongodb connection successful");
  }
);



app.listen(4000, () => {
  console.log("app listening on port 4000");
});