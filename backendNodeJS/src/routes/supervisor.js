const express = require('express')
const router = express.Router();
const supervisorController = require('../controllers/supervisorController')

router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to RayRay /api/supervisor." });
});


//topic management
router.get("/topic/view", supervisorController.viewTopic)
router.get("/topic/:id", supervisorController.viewSpecificTopic)
router.post("/topic/create", supervisorController.createTopic);
router.post("/topic/update", supervisorController.updateTopic);
router.post("/topic/delete", supervisorController.deleteTopic)
//group management
router.get("/group/view", supervisorController.viewTopicGroup)
router.get("/group/:id", supervisorController.viewSpecificTopicGroup)
router.post("/group/approveGroup", supervisorController.approveGroup)
router.post("/group/rejectGroup", supervisorController.rejectGroup)
router.post("/group/addStudent", supervisorController.addStudent)
router.post("/group/adjustGroup", supervisorController.adjustGroup)


module.exports = router