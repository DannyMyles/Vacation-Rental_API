const express=require('express');
const { contactUs } = require('../../controllers/User/contact_us_controller');
const router=express.Router();


router.post('/',contactUs);

module.exports=router;