const express = require('express')
const router = express.Router();
const supervisorController = require('../controllers/supervisorController')

router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to RayRay /api/supervisor." });
});


//topic management
router.get("/topic/view", supervisorController.viewTopic)
router.post("/topic/create", supervisorController.createTopic);
router.post("/topic/update", supervisorController.updateTopic);
router.post("/topic/delete", supervisorController.deleteTopic)



module.exports = router