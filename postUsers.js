const userModel = require("./userdb.js");
const postUsers = async (req, res) => {
  try {
    const newUser = req.body;
    const existing = await userModel.findOne({ userName: req.body.userName });
    if (existing) {
      res.status(400).send("alredy existing"); // bad request error
    } else {
      const salt = await bcrypt.genSalt();
      const hashedpass = await bcrypt.hash(req.body.password, salt);
      const plus = { userName: req.body.userName, password: hashedpass };
      const addUser = await userModel.create(plus);
      return res.status(201).json({ msg: "User created" });
    }
  } catch {
    res.status(500).send(); //internal server error
  }
};

module.exports = postUsers;
