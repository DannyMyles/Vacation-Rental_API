const express = require("express");
const router = express.Router();

const {
  getAllAmenity,
  addAmenity,
  updateAmenity,
  deleteAmenity,
} = require("../../controllers/User/amenities_controller");

router.get("/get_all_amenities", getAllAmenity);
router.post("/add_amenities", addAmenity);
router.put("/update_amenities", updateAmenity);
router.delete("/delete_amenities", deleteAmenity);

module.exports = router;
