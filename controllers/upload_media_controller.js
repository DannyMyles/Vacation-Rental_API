const helper = require("../helper/helper");
const catchAsyncFunc = require("../middlewares/catchAsyncFunc");
const { imageUpload } = require("../utils/imageUpload");

exports.uploadMedia = catchAsyncFunc(async (req, res, next) => {
  const images = req.files;
  const imageURLs = [];
  if (images?.length > 0) {
    const imagesObj = await imageUpload(images);
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

  return helper.sendSuccess(res, { imageURLs }, req);
});
