const express=require('express');
const { sendMessage, getMessages } = require('../controllers/message_controller');
const router=express.Router();

// send message
router.post('/send', sendMessage);
router.get('/', getMessages);

module.exports=router;  