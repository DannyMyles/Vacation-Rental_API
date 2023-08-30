const User = require("../../models/User");
const helper = require("../../helper/helper");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const createSession = require("../../utils/createSession");
const { imageUpload } = require("../../utils/imageUpload");

exports.getAllUsers = catchAsyncFunc(async (req, res, next) => {
  const result = await User.find();
  return helper.sendSuccess(res, result, req, "Success");
});

exports.getUser = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findById(req.user).select(
    "-password -fcmToken -resetToken -verifyToken -__v"
  );
  if (!user) {
    return helper.sendError(403, res, { error: "User not found" }, req);
  }
  return helper.sendSuccess(res, user, req, "Success");
});

// OPTIONAL:::  Add User
exports.addUser = async (req, res, next) => {
  const userData = req.body;
  const is_exist = await User.findOne({ email: userData.email });
  if (is_exist)
    return helper.sendError(403, res, { error: "User already exists" }, req);

  const user = await User.create(userData);
  createSession(user, req, res);
};

exports.searchUser = catchAsyncFunc(async (req, res, next) => {
  const { name } = req.query;
  if (!name)
    return helper.sendError(
      403,
      res,
      { error: "Please provide search string" },
      req
    );

  const result = await User.find({
    $or: [
      { first_name: { $regex: name, $options: "i" } },
      { last_name: { $regex: name, $options: "i" } },
    ],
  })
    .find({ _id: { $ne: req.user } })
    .select("first_name last_name profilePic");

  return helper.sendSuccess(res, result, req, "Success");
});

exports.updateUser = catchAsyncFunc(async (req, res, next) => {
  const userData = req.body;
  const user = await User.findById(req.user);
  if (!user) {
    return helper.sendError(403, res, { error: "User not found" }, req);
  }
  if (userData.age) {
    if (userData.age < 1 || userData.age > 100) {
      return helper.sendError(
        400,
        res,
        { error: "Age should be between 1 and 100" },
        req
      );
    }
  }

  const imageURL = req.body.imageURL


  const cleanedData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== "")
  );

  const updatedData = {
    ...cleanedData,
    profilePic: imageURL ? imageURL : user.profilePic,
  };


  const result = await User.findByIdAndUpdate(
req.user,
    {
      $set: updatedData,
    },
    {
      new: true,
    }
  );

  return helper.sendSuccess(res, result, req, "Success");
});

// Block User
exports.blockUser = catchAsyncFunc(async (req, res, next) => {
  const { user_id } = req.query;
  await User.findByIdAndUpdate(user_id, {
    new: true,
    runValidators: true,
    userFindANdModify: false,
  });
  helper.sendSuccess(
    res,
    { msg: "User blocked successfully." },
    req,
    "Success"
  );
});

// Delete User
exports.deleteUser = catchAsyncFunc(async (req, res, next) => {
  const { user_id } = req.query;
  await User.findByIdAndDelete(user_id);
  helper.sendSuccess(
    res,
    { msg: "User deleted successfully." },
    req,
    "Success"
  );
});
