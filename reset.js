const TaskModel = require("./taskdata");
const reset = async (req, res) => {
  const deleteall = await TaskModel.deleteMany({});
  try {
    if (!deleteall) {
      return res.status(404).json({ msg: "no data to delete" });
    }
    return res.status(200).json({ msg: "sucessfully deleted" });
  } catch (error) {
    res.status(500).json({ msg: "failed to delete " });
  }
};

module.exports = reset;
