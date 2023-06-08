const express = require("express");
const Router = express.Router();

const Aunthenticate = require("../middlewares/Authenticate");
const TodoSchema = require("../Modals/Todo");
const UserSchema = require("../Modals/UserSchema");

Router.get("/", (req, res) => {
  res.send("hello world !!!!!!!");
});

Router.post("/", Aunthenticate, async (req, res) => {
  try {
    const user = req.user;
    const todo = new TodoSchema(req.body);
    const newTodo = await todo.save();
    user.todos.push(newTodo._id);
    const newUser = await user.save();
    const response = {
      data: newUser,
      message: "Todo saved successfully",
      statusCode: 200,
    };
    res.json(response);
  } catch (error) {
    console.log("todo api error", error);
  }
});

Router.put("/status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await TodoSchema.findById(id);
    todo.isActive = !todo.isActive;
    const updatedTodo = await todo.save();
    // const todo = await TodoSchema.findByIdAndUpdate(id, {isActive : !isActive},{new :true});
    console.log("updated todo", updatedTodo);
    res.json({ status: 200, msg: "status changed successfully", data: todo });
  } catch (error) {
    console.log("status api error", error);
  }
});

Router.put("/:id", async (req, res) => {
  try {
    TodoSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("An error occurred");
        } else if (result) {
          res.status(201).send(result);
        } else {
          res.status(400).send("todo not found");
        }
      }
    );
  } catch (error) {
    console.log("todo api error", error);
  }
});

Router.delete("/:id", async (req, res) => {
  try {
    const user = await UserSchema.findOne({ todos: req.params.id });
    if (user) {
      const index = user.todos.indexOf(req.params.id);
      console.log("todoo===", user);
      if (index !== -1) {
        user.todos.splice(index, 1);
        user.save();
        res.json({ msg: "todo deleted successfully", data: user, status: 200 });
      } else {
        res.status(404).send("Todo not found");
      }
    } else {
      res.status(404).json({ message: "this todo does not exist" });
    }
  } catch (error) {
    console.log("todo api error in delete", error);
  }
});

module.exports = Router;
