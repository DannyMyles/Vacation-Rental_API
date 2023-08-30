const express=require("express");
const { applyForJob } = require("../controllers/career_controller");
const router=express.Router();

router.post("/apply", applyForJob);

module.exports=router;