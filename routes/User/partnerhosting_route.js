const express = require("express");
const router = express.Router();


const {
  addPartnerHosting,
  deletePartnerHosting,
  updatePartnerHosting,
  getPartnerHosting,
  getAllPartnerHosting,
} = require("../../controllers/User/partnerhosting_controller");



router.post("/hosting/add", addPartnerHosting);
router.delete("/hosting/delete",  deletePartnerHosting);
router.put("/hosting/update", updatePartnerHosting);
router.get("/hosting/get", getPartnerHosting);
router.get("/hosting", getAllPartnerHosting);

module.exports = router;
