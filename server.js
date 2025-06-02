require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

//middlewares
const displayserver = require("./displaymovies");
const show = require("./showmovies");
const send = require("./postmovies");
const update = require("./update.js");
const deleteTask = require("./deleteTask");
const reset = require("./reset");

const TaskModel = require("./taskdata");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("connection established"));

const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", displayserver);

app.get("/tasks", show);

app.post("/tasks", send);
app.put("/update/tasks/:id", update);

app.delete("/delete/:id", deleteTask);

app.delete("/deleteall", reset);

app.listen(3000, () => {
  console.log("server has started");
});
