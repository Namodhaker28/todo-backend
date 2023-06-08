const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const TodoSchema = new moongoose.Schema([
  {
    todo: { type: String },
    isActive: {
      type: Boolean,
    },
  },
]);

module.exports = mongoose.model("Todo", TodoSchema);
