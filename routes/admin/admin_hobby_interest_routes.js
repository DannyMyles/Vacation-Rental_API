const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/admin_hobby_interest_controller");
const {
  createHobbyInterestValidators,
} = require("../../middlewares/admin/admin_hobby_interest_middlewares");

router.post(
  "/createHobbyInterest",
  createHobbyInterestValidators,
  controller.createHobbyInterest
);

module.exports = router;
