const helper = require("../helper/helper");
const catchAsyncFunc = require("../middlewares/catchAsyncFunc");
const About = require("../models/About");
const { imageUpload } = require("../utils/imageUpload");

exports.getAbout = async (req, res, next) => {
  const result = await About.find();
  return helper.sendSuccess(res, result, req, "Success");
}

exports.createAbout = catchAsyncFunc(async (req, res, next) => {
  const { title, description } = req.body;
  const image=req.files;

  if (!title || !description) {
    return helper.sendError(400, res, {
      error: "Please provide description and title",
    }, req);
  }
  const imageURLs = [];

  if(image){
    const imagesObj=await imageUpload(image);

    if (!imagesObj.success) {
      return helper.sendError(
        500,
        res,
        {
          error: imagesObj.message,
        },
        req
      );
    }
    imageURLs.push(...imagesObj.downloadURLs);

  }


    const about = await About.create({
        title,
        description,
        image:imageURLs[0] || null
    });
  if (about) {
    return helper.sendSuccess(res, about, req, "Success");
  } else {
    return helper.sendError(500, res,{
      error:"Please try again later"
    }, req);
  }
});
