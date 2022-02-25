const express = require('express')
const router = express.Router();
const fetch = require('node-fetch')
const multer = require("multer");
const upload = multer();
const adminController = require('../controllers/adminController')

router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to RayRay /api/admin." });
});

// internal controller
// create account
router.post("/createAccounts", upload.single('avatar'), adminController.createAccounts)

// peer review form
router.post("/createPeerReview", adminController.createPeerReview)
router.get("/viewPeerReview", adminController.viewPeerReview)


// peer review question
router.post("/createPeerReviewQuestion", adminController.createPeerReviewQuestion)
router.get("/viewPeerReviewQuestion", adminController.viewPeerReviewQuestion)
router.get("/viewSpecificPeerReview/:id", adminController.viewSpecificPeerReview)
router.post("/editSpecificPeerReview", adminController.editSpecificPeerReview)
router.post("/deleteSpecificPeerReviewForm", adminController.deleteSpecificPeerReviewForm)


// redirect to flask server 
router.get("/test", async (req, res) => {
    const response = await fetch("http://localhost:5001").then(res => res.json())
    console.log(response)
    res.status(200).json(response)
})




module.exports = router