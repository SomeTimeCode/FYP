const express = require('express')
const router = express.Router();
const StudentController = require("../controllers/studentController")


router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to RayRay /api/student." });
});

router.get("/topic/view", StudentController.viewTopic)
// joining or creating group
router.get("/topic/:id" , StudentController.viewSpecificTopic)
router.post("/topic/createGroup", StudentController.createGroup)
router.post("/topic/joinGroup", StudentController.joinGroup)

// peer review
router.get("/viewPeerReviewForm", StudentController.viewPeerReviewForm)
router.get("/viewSpecificPeerReviewForm/:id", StudentController.viewSpecificPeerReviewForm)
router.post("/editSpecificPeerReviewForm", StudentController.editSpecificPeerReviewForm)

module.exports = router