const TaskModel = require("./taskdata");
const send = async (req, res) => {
  const newTask = req.body;
  const existing = await TaskModel.findOne({
    dat: newTask.dat,
    timer: newTask.timer,
  });
  if (!existing) {
    const addTask = await TaskModel.create(newTask);
  } else {
    return res.json({
      msg: "a task is akredy exist at same Date and same Time",
    });
  }

  if (!newTask) {
    return res.status(400).json({ error: "task is required" });
  }
  console.log(newTask);
  res.status(201).json({ msg: "data added" });
};

module.exports = send;
