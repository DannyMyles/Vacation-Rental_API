const jwt = require("jsonwebtoken");
const helper = require("../../helper/helper");
const OTP = require("../../models/OTP");
const User = require("../../models/User");
const sendOTP = require("../../utils/sendOTP");
const createSession = require("../../utils/createSession");

exports.sendotp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile)
    return helper.sendError(
      403,
      res,
      { error: "Mobile number cannot be empty" },
      req
    );

  if (!helper.validatePhone(mobile)) {
    return helper.sendError(
      403,
      res,
      { error: "Please enter a valid mobile number." },
      req
    );
  }

  const user = await User.findOne({ mobile });
  if (!user) {
    return helper.sendError(
      403,
      res,
      { error: "Mobile number not found" },
      req
    );
  }
  if (user.mobileVerified) {
    return helper.sendError(
      403,
      res,
      { error: "Mobile number already verified" },
      req
    );
  }

  const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3m",
  });

  await User.findOneAndUpdate(
    { _id: user._id },
    { verifyToken: token },
    { new: true, runValidators: false, useFindAndModify: false }
  );

  const response = await sendOTP(mobile, "Your OTP is: ");
  if (response.success) {
    return helper.sendSuccess(res, "OTP sent", req, "Success");
  } else {
    return helper.sendError(500, res, { error: "Failed to send OTP" }, req);
  }
};

exports.verifyotp = async (req, res) => {
  const { otp } = req.body;

  const is_exist = await OTP.findOne({ otp });

  if (!is_exist)
    return helper.sendError(403, res, { error: "No record found" }, req);

  const userWithMobile = await User.findOne({ mobile: is_exist.mobile });
  if (!userWithMobile)
    return helper.sendError(403, res, { error: "No user found" }, req);

  const checkIfVerified = await User.findOne({
    mobile: is_exist.mobile,
    mobileVerified: true,
  });
  if (checkIfVerified)
    return helper.sendError(
      403,
      res,
      { error: "Mobile number already verified" },
      req
    );

  if (is_exist.otp !== otp)
    return helper.sendError(403, res, { error: "Invalid OTP" }, req);

  try {
    const decodedToken = jwt.verify(
      userWithMobile.verifyToken,
      process.env.JWT_SECRET
    );
    await OTP.findByIdAndDelete(is_exist._id);
    await User.findOneAndUpdate(
      {
        _id: decodedToken.user_id,
      },
      {
        mobileVerified: true,
        verifyToken: null,
      },
      {
        new: true,
      }
    );

    createSession(userWithMobile, req, res, userWithMobile.rememberMe);
  } catch (err) {
    await User.findOneAndUpdate(
      {
        _id: userWithMobile._id,
      },
      {
        verifyToken: null,
      },
      {
        new: true,
      }
    );
    return helper.sendError(500, res, { error: err.message }, req);
  }
};
