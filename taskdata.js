const mongoose = require("mongoose");
const TaskSchema = mongoose.Schema({
  name: String,
  dat: String,
  catogery: String,
  timer: String,
  priority: String,
});

const TaskModel = mongoose.model("taskname", TaskSchema);

module.exports = TaskModel;
