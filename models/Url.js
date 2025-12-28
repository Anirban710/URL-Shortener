const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        unique: true,
        index: true
    },
    longUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
});

module.exports = mongoose.model("Url", urlSchema);
