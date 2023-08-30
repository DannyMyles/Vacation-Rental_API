const express = require("express");
const router = express.Router();
const {
  getAllRoomates,
  getRoomates,
  addRoomate,
  updateRoomateProfile,
  deleteRoomate,
} = require("../../controllers/User/roomate_controller");
const upload = require("../../utils/multerUpload");

router.get("/get_all_roomates", getAllRoomates);
router.get("/get_roomates", getRoomates);
router.post("/add_roomate", upload, addRoomate);
router.put("/update_roomate_profile",upload, updateRoomateProfile);
router.delete("/perm_del_roomate", deleteRoomate);

module.exports = router;
