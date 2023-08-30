const express = require("express");
const { saveFCMToken, customFeature, getAllNotifications } = require("../controllers/notification_controller");
const router = express.Router();

router.post("/device", saveFCMToken);
router.post("/send", customFeature)
router.get("/all", getAllNotifications)

module.exports = router;
