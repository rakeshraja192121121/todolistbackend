const TaskModel = require("./taskdata");
const update = async (req, res) => {
  const updateddata = req.body;
  const updateTask = await TaskModel.findOneAndUpdate(
    { _id: req.params.id },
    updateddata,
    { new: true }
  );
};
module.exports = update;
