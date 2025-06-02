require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const TaskModel = require("./taskdata");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("connection established"));

const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "hey server" });
});

app.get("/tasks", async (req, res) => {
  const showdata = await TaskModel.find();
  console.log(showdata);
  res.status(200).json(showdata);
});

app.post("/tasks", async (req, res) => {
  const newTask = req.body;
  const existing = await TaskModel.findOne({
    dat: newTask.dat,
    timer: newTask.timer,
  });
  if (!existing) {
    const addTask = await TaskModel.create(newTask);
  } else {
    return res.json({
      msg: "a task is akredy exist at same Date and same Time",
    });
  }

  if (!newTask) {
    return res.status(400).json({ error: "task is required" });
  }
  console.log(newTask);
  res.status(201).json({ msg: "data added" });
});
app.put("/update/tasks/:id", async (req, res) => {
  const updateddata = req.body;
  const updateTask = await TaskModel.findOneAndUpdate(
    { _id: req.params.id },
    updateddata,
    { new: true }
  );
});

app.delete("/delete/:id", async (req, res) => {
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
});

app.delete("/deleteall", async (req, res) => {
  const deleteall = await TaskModel.deleteMany({});
  try {
    if (!deleteall) {
      return res.status(404).json({ msg: "no data to delete" });
    }
    return res.status(200).json({ msg: "sucessfully deleted" });
  } catch (error) {
    res.status(500).json({ msg: "failed to delete " });
  }
});

app.listen(3000, () => {
  console.log("server has started");
});
