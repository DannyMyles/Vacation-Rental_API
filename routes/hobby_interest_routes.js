const express = require("express");
const router = express.Router();
const {
  getAllHobbyInterest,
  addHobbyInterest,
  updateHobbyInterest,
  deleteInterest,
} = require("../controllers/hobby_interest_controller");

router.get("/get_all_hobby_interest", getAllHobbyInterest);
router.post("/add_hobby_interest", addHobbyInterest);
router.put("/update_hobby_interest", updateHobbyInterest);
router.delete("/delete_hobby_interest", deleteInterest);

module.exports = router;
