const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
    shortCode: String,
    clickedAt: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
});

module.exports = mongoose.model("Click", clickSchema);
