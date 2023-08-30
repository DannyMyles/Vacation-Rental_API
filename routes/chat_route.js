const express = require("express");
const {
  searchChat,
  renameChat,
  getAllChats,
  createGroupChat,
  createChat,
  removeUsersFromGroupChat,
  addUsersToGroupChat,
  deleteGroupChat,
} = require("../controllers/chat_controller");
const router = express.Router();
/**
 * @swagger
 * /v1/chat/search:
 *  get:
 *   tags:
 *   - Chat
 *   description: Search Chat
 *   produces:
 *    - application/json
 *   responses:
 *     200:
 *      description: Search Chat
 *     400:
 *     description: Error
 * 
 * 
 */

router.get("/search", searchChat);

router.put("/rename", renameChat);
router.post("/create", createChat);
router.get("/", getAllChats);
router.post("/group/create", createGroupChat);
router.put("/group/add", addUsersToGroupChat);
router.put("/group/remove", removeUsersFromGroupChat);
router.delete("/group", deleteGroupChat);

module.exports = router;
