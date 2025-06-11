const userModel = require("./userdb.js");
const postLogins = async (req, res) => {
  const users = await userModel.findOne({ userName: req.body.userName });
  if (users == null) {
    res.status(400).send("no username is found");
  }
  try {
    if (await bcrypt.compare(req.body.password, users.password)) {
      res.send("success");
    } else {
      res.send("invalid password");
    }
  } catch {
    res.status(500).send();
  }
};

module.exports = postLogins;
