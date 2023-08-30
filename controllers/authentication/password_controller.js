const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const {
  sendForgotPasswordEmail,
} = require("../../utils/sendMail");
const helper = require("../../helper/helper");
const bcrypt = require("bcryptjs");
const sendOTP = require("../../utils/sendOTP");
const OTP = require("../../models/OTP");

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return helper.sendError(403, res, { error: "Invalid token" }, req);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return helper.sendError(403, res, { error: "Invalid token" }, req);
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.user_id });
    if (!user) {
      return helper.sendError(403, res, { error: "User not found" }, req);
    }
    if (!user.resetToken) {
      return helper.sendError(403, res, { error: "Invalid token" }, req);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate(
      {
        _id: user._id,
      },

      {
        password: hashedPassword,
        resetToken: null,
      },
      {
        new: true,
      }
    );
    return helper.sendSuccess(
      res,
      "Password reset successfully",
      req,
      "Success"
    );
  } catch (err) {
    return helper.sendError(500, res, { error: "Session Expired" }, req);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { method, email, mobile } = req.body;
  if (!method) {
    return helper.sendError(403, res, { error: "Invalid method" }, req);
  }

  if (method === "custom_email") {
    if (!email) {
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid email address." },
        req
      );
    }

    if (!helper.validateEmail(email)) {
      return helper.sendError(400, res, { error: "Invalid email" }, req);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return helper.sendError(403, res, { error: "User not exists" }, req);
    }
    if (!user.emailVerified) {
      return helper.sendError(
        403,
        res,
        { error: "Please verify your email" },
        req
      );
    }
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    await User.findOneAndUpdate(
      {
        _id: user._id,
      },

      {
        resetToken: token,
      },
      {
        new: true,
      }
    );
    await sendForgotPasswordEmail(email, token);
    return helper.sendSuccess(
      res,
      "Email sent to reset password",
      req,
      "Success"
    );
  } else if (method === "custom_phone") {
    if (!mobile) {
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid mobile number." },
        req
      );
    }

    if (!helper.validatePhone(mobile)) {
      return helper.sendError(
        400,
        res,
        {
          error: "Invalid mobile phone",
        },
        req
      );
    }

    const user = await User.findOne({ mobile: mobile });
    if (!user) {
      return helper.sendError(403, res, { error: "User not exists" }, req);
    }
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    await User.findOneAndUpdate(
      {
        _id: user._id,
      },

      {
        resetToken: token,
      },
      {
        new: true,
      }
    );
    const response = await sendOTP(mobile, "Your reset password OTP is: ");
    if (!response.success) {
      return helper.sendError(500, res, { error: "Failed to send OTP" }, req);
    }

    return helper.sendSuccess(res, token, req, "Success");
  }
};

exports.verfiyResetPasswordOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    const existing_otp = await OTP.findOne({ otp });
    if (!existing_otp || existing_otp.otp !== otp) {
      return helper.sendError(403, res, { error: "Invalid OTP" }, req);
    }

    const user = await User.findOne({ mobile: existing_otp.mobile });
    if (!user) {
      return helper.sendError(403, res, { error: "User not found" }, req);
    }

    if (!user.resetToken) {
      return helper.sendError(403, res, { error: "Invalid token" }, req);
    }

    if (!user.mobileVerified) {
      return helper.sendError(
        403,
        res,
        { error: "Your mobile number is not verified" },
        req
      );
    }

    await OTP.findByIdAndDelete(existing_otp._id);
    return helper.sendSuccess(res, "OTP verified", req, "Success");
  } catch (err) {
    return helper.sendError(500, res, { error: "Session Expired" }, req);
  }
};



