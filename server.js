require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const rateLimit = require("express-rate-limit");


const app = express();
app.use(express.json());
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10
});
app.use(limiter);

app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
