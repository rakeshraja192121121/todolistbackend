const TaskModel = require("./taskdata");
const deleteTask = async (req, res) => {
  try {
    const deletetask = await TaskModel.deleteOne({ _id: req.params.id });
    if (deletetask.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = deleteTask;
