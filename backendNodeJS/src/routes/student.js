const express = require('express')
const router = express.Router();
const StudentController = require("../controllers/studentController")


router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to RayRay /api/student." });
});

router.get("/topic/view", StudentController.viewTopic)
// joining or creating group
router.get("/topic/:id" , StudentController.viewSpecificTopic)
router.post("/topic/:id/createGroup", StudentController.createGroup)

module.exports = router