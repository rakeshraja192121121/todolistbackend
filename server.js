require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

//controlers
const displayserver = require("./displaymovies.js");
const show = require("./showmovies.js");
const send = require("./postmovies.js");
const update = require("./update.js");
const deleteTask = require("./deleteTask.js");
const reset = require("./reset.js");
const allUsers = require("./showallusers");
// const postUsers = require("./postUsers");
const postLogins = require("./postLogin");
// const users = require("./user");
// const add = require("./addusers.js");

const TaskModel = require("./taskdata.js");
const userModel = require("./userdb.js");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/users", allUsers);
app.post("/users", async (req, res) => {
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
});

app.post("/users/login", async (req, res) => {
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
});

app.get("/", displayserver);

app.get("/tasks", show);

app.post("/tasks", send);
app.put("/update/tasks/:id", update);

app.delete("/delete/:id", deleteTask);

app.delete("/deleteall", reset);

app.listen(3000, () => {
  console.log("server has started");
});
