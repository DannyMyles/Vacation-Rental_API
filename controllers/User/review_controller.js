const Review = require("../../models/Review");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");


const helper = require("../../helper/helper");
const { imageUpload } = require("../../utils/imageUpload");


exports.getReviews = catchAsyncFunc(async (req, res, next) => {
  const result = await Review.find({ status: 1 });
  helper.sendSuccess(res, { review: result }, req, "Success");
});

exports.addReview = catchAsyncFunc(async (req, res, next) => {
  const images = req.files;

  const imageURLs = [];


  if (images?.length > 0) {
    const imagesObj=await imageUpload(images);
    if (!imagesObj.success) {
      return helper.sendError(
        400,
        res,
        {
          error: imagesObj.message,
        },
        req
      );
    }
    imageURLs.push(...imagesObj.downloadURLs);
 


  }


  const reviewData = req.body;
  if(req.files){
    reviewData.images = imageURLs;
  }

  if(!reviewData.user_id || !reviewData.room_id) return helper.sendError(res, { error: "User or Room not found." }
  );

  reviewData.user=reviewData.user_id;
  reviewData.room=reviewData.room_id;
  
 
  const result = await Review.create(reviewData);
  helper.sendSuccess(res, { review: result }, req, "Success");
});





exports.updateReview = catchAsyncFunc(async (req, res, next) => {
  const reviewData = req.body;
  const { review_id } = req.query;
  if(!review_id) return helper.sendError(res, { error: "Review id not found." }
  );
  const images = req.files;

  const imageURLs = [];


  if (images?.length > 0) {
    const imagesObj=await imageUpload(images);
    if (!imagesObj.success) {
      return helper.sendError(
        400,
        res,
        {
          error: imagesObj.message,
        },
        req
      );
    }
    imageURLs.push(...imagesObj.downloadURLs);
 


  }
  reviewData.images = imageURLs;
  const result = await Review.findByIdAndUpdate(review_id, reviewData, {
    new: true,
    runValidators: true,
    userFindANdModify: false,
  });
  helper.sendSuccess(res, { review: result }, req, "Success");
});






exports.blockReview = catchAsyncFunc(async (req, res, next) => {
  // const reviewData = req.body;
  const { review_id } = req.query;
  if(!review_id) return helper.sendError(res, { error: "Review id not found." }
  );
 await Review.findByIdAndUpdate(
    review_id,
    { status: 0 },
    {
      new: true,
      runValidators: true,
      userFindANdModify: false,
    }
  );
  helper.sendSuccess(
    res,
    { msg: "Review blocked successfully." },
    req,
    "Success"
  );
});



exports.deleteReview = catchAsyncFunc(async (req, res, next) => {
  const { review_id } = req.query;
if(!review_id) return helper.sendError(res, { error: "Please add a review id" }
  );
   await Review.findByIdAndDelete(review_id);
  helper.sendSuccess(
    res,
    { msg: "Review deleted successfully." },
    req,
    "Success"
  );
});
