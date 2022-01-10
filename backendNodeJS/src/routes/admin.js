const express = require('express')
const router = express.Router();
const fetch = require('node-fetch')

router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to RayRay /api/admin." });
});

router.get("/test", async (req, res) => {
    const response = await fetch("http://localhost:5001").then(res => res.json())
    console.log(response)
    res.status(200).json(response)
})


module.exports = router