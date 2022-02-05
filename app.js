const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
const Students = require("./model/student");

app.get("/", (req, res) => {
  res.json({ name: "confidence" });
});

app.post("/register", (req, res) => {
  const { firstName, lastName, email, address, phoneNumber } = req.body;
  const newStudent = new Students({
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
  });
  newStudent.save();
  res.json(newStudent);
});

// Get all students from database
app.get("/students", async (req, res) => {
  const students = await Students.find();
  res.json(students);
});

app.get("/student/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const student = await Students.findById(id);

    if (!student) {
      return res.status(404).json({ msg: "This student does not exist." });
    }

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

app.put("/edit/:id", async (req, res) => {
  const { firstName, lastName, email, address, phoneNumber } = req.body;

  const student = await Students.findByIdAndUpdate(req.params.id, {
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
  });

  if (!student) {
    return res.status(404).json({ msg: "This student does not exist" });
  }

  return res.status(200).json({ msg: "updated successfully" });
});

app.delete("/student/:id", async (req, res) => {
  const student = await Students.findByIdAndDelete(req.params.id);

  if (!student) {
    return res.status(404).json({ msg: "This Student does not exist" });
  }

  return res.status(200).json({ msg: "Deleted Successfully" });
});

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Database Connected");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on PORT 5000");
});
