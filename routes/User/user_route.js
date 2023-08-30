const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  addUser,
  updateUser,
  blockUser,
  deleteUser,
  searchUser,
  getUser
  
} = require("../../controllers/User/user_controller");
const upload = require("../../utils/multerUpload");



router.get("/get_all_users", getAllUsers);
router.get("/", getUser);
router.post("/add_user", addUser);
router.put("/update_user", upload, updateUser);
router.get("/search", searchUser);
router.put("/soft_del_user", blockUser);
router.delete("/perm_del_user", deleteUser);

module.exports = router;
