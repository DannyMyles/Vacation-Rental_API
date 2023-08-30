const express = require("express");
const router = express.Router();

const {
  getRoles,
  addRole,
  updateRole,
  userRoles,
  blockRole,
  deleteRole,
  blockUserRole,
} = require("../../controllers/User/role_controller");

router.get("/get_all_roles", getRoles);
router.get("/get_user_roles", userRoles);
router.post("/add_user_role", addRole);
router.put("/update_user_role", updateRole);
router.put("/block_user_role", blockUserRole);
router.put("/block_role", blockRole);
router.delete("/delete_role", deleteRole);

module.exports = router;
