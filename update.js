const TaskModel = require("./taskdata");

const update = async (req, res) => {
  try {
    const updateddata = req.body;
    const updateTask = await TaskModel.findOneAndUpdate(
      { _id: req.params.id },
      updateddata,
      { new: true }
    );
    if (!updateTask) {
      return res.status(401).json("empty");
    }
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(500).json("inernal server error");
  }
};
module.exports = update;
