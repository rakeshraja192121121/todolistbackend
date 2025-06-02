const TaskModel = require("./taskdata");
const show = async (req, res) => {
  const showdata = await TaskModel.find();
  console.log(showdata);
  res.status(200).json(showdata);
};

module.exports = show;
