const TaskModel = require("./taskdata");
const show = async (req, res) => {
  const userName = await req.query.userName;
  const showdata = await TaskModel.find({ user: userName });
  console.log(showdata);
  res.status(200).json(showdata);
};

module.exports = show;
