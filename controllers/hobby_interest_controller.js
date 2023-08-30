const HobbyInterest = require("../models/hobby_interest_model");
const { StatusCodes } = require("http-status-codes");
const catchAsyncFunc = require("../middlewares/catchAsyncFunc");
const helper = require("../helper/helper");

exports.getAllHobbyInterest = async (req, res, next) => {
  try {
    const data = await HobbyInterest.find();

    if (!data) {
      return next(new Error("Something went wrong, please try again later"));
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Hobby/Interest list",
      data,
    });
  } catch (err) {
    console.log(`ERROR :: getAllHobbyInterest :: ${err}`);
    next(err);
  }
};
exports.addHobbyInterest = catchAsyncFunc(async (req, res, next) => {
  const { name } = req.body;
  const is_exist = await HobbyInterest.findOne({ name: name });
  if (is_exist)
    return helper.sendError(403, res, { msg: "Already exists" }, req);

  const result = await HobbyInterest.create({ name: name });
  if (result) return helper.sendSuccess(res, result, req, "Success");
  else return helper.sendError(500, res, { msg: "Something went wrong" }, req);
});
exports.updateHobbyInterest = catchAsyncFunc(async (req, res, next) => {
  const { interestId } = req.query;
  const { name } = req.body;
  const result = await HobbyInterest.findByIdAndUpdate(
    interestId,
    { name: name },
    {
      new: true,
      runValidators: true,
      userFindByIdAndModify: false,
    }
  );
  if (result)
    return helper.sendSuccess(
      res,
      { msg: "Updated successfully" },
      req,
      "Success"
    );
  else return helper.sendError(500, res, { msg: "Something went wrong" }, req);
});
exports.addHobbyInterest = catchAsyncFunc(async (req, res, next) => {
  const { name } = req.body;
  const is_exist = await HobbyInterest.findOne({ name: name });
  if (is_exist)
    return helper.sendError(403, res, { msg: "Already exists" }, req);

  const result = await HobbyInterest.create({ name: name });
  if (result) return helper.sendSuccess(res, result, req, "Success");
  else return helper.sendError(500, res, { msg: "Something went wrong" }, req);
});

exports.deleteInterest = catchAsyncFunc(async (req, res, next) => {
  const { interestId } = req.query;
  const result = await HobbyInterest.findByIdAndDelete(interestId);
  if (result)
    return helper.sendSuccess(
      res,
      { msg: "deleted successfully" },
      req,
      "Success"
    );
  else return helper.sendError(500, res, { msg: "Something went wrong" }, req);
});
