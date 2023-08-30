const express = require("express");
const router = express.Router();
// const { IsAuth } = require("../../../middlewares/auth");
const {
  getReviews,
  addReview,
  updateReview,
  blockReview,
  deleteReview,
} = require("../../controllers/User/review_controller");
const upload = require("../../utils/multerUpload");

router.get("/get-reviews-ratings", getReviews);
router.post("/add_review", upload, addReview);
router.put("/update_review",upload, updateReview);
router.put("/soft_del_review", blockReview);
router.delete("/perm_del_review", deleteReview);

module.exports = router;
