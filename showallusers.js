const userModel = require("./userdb.js");
const allUsers = async (req, res) => {
  const allUsers = await userModel.find();
  res.json(allUsers);
};
module.exports = allUsers;
