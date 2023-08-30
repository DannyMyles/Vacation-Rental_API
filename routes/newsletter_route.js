const express = require("express");
const { subscribeToNewsletter, unsubscribeNewsletter } = require("../controllers/User/newsletter_controller");


const router = express.Router();

router.post("/subscribe", subscribeToNewsletter);
router.delete("/unsubscribe", unsubscribeNewsletter);

module.exports = router;