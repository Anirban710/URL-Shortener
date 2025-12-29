const express = require("express");
const Url = require("../models/Url");
const encode = require("../Utils/Base62");
const Click = require("../models/clicks");
const redisClient = require("../config/Redis");



const router = express.Router();

router.post("/shorten", async (req, res) => {
    const { longUrl, expiresInDays } = req.body;

    const url = await Url.create({ longUrl });

    const id = parseInt(url._id.toString().slice(-8), 16);
    const shortCode = encode(id);

    url.shortCode = shortCode;

    if (expiresInDays) {
        url.expiresAt = new Date(Date.now() + expiresInDays * 86400000);
    }

    await url.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    res.json({
        shortUrl: `${baseUrl}/${shortCode}`
    });

});

router.get("/:code", async (req, res) => {
    const code = req.params.code;

// 1. Try Redis first
const cachedUrl = await redisClient.get(code);

if (cachedUrl) {
    await Click.create({
        shortCode: code,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });
    return res.redirect(cachedUrl);
}

// 2. If not in Redis, get from MongoDB
const url = await Url.findOne({ shortCode: code });

if (!url) {
    return res.status(404).send("Short URL not found");
}

// 3. Store in Redis for next time
await redisClient.set(code, url.longUrl);

// 4. Save click
await Click.create({
    shortCode: code,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
});

res.redirect(url.longUrl);

});

router.get("/api/analytics/:code", async (req, res) => {
    const code = req.params.code;

    const totalClicks = await Click.countDocuments({ shortCode: code });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayClicks = await Click.countDocuments({
        shortCode: code,
        clickedAt: { $gte: today }
    });

    res.json({
        shortCode: code,
        totalClicks,
        todayClicks
    });
});

module.exports = router;
