const express = require('express');
const router = express.Router();
const redis = require("../redis")

router.get("/", async (req, res) => {
    const stats = await redis.getAsync("added_todos")
    res.send({ "added_todos": stats ? parseInt(stats) : 0 })
})

module.exports = router;
