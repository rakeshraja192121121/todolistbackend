const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: { type: String, required: [true, "taskname is required"] },
  dat: { type: String, required: [true, "date is required"] },
  catogery: { type: String, required: [true, "catogery is required"] },
  timer: { type: String, required: [true, "time is required"] },
  priority: { type: String, required: [true, "priority is required"] },
  completed: { type: Boolean, default: false },
  user: { type: String },
});

const TaskModel = mongoose.model("taskname", TaskSchema);

module.exports = TaskModel;
