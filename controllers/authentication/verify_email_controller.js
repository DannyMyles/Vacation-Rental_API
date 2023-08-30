const helper = require("../../helper/helper");
const User = require("../../models/User");
const createSession = require("../../utils/createSession");
const { sendVerificationEmail } = require("../../utils/sendMail");
const jwt = require("jsonwebtoken");

exports.verifyEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return helper.sendError(
      403,
      res,
      { error: "Please enter a valid email address." },
      req
    );
  }
  const user = await User.findOne({ email });
  if (!user && !user.emailVerified) {
    return helper.sendError(403, res, { error: "User not found" }, req);
  }
  const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      verifyToken: token,
    },
    {
      new: true,
    }
  );

  await sendVerificationEmail(email, token);

  return helper.sendSuccess(res, "Email sent", req, "Success");
};

exports.verifyEmailToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
 
    const user = await User.findOne({ _id: decodedToken.user_id });
    if (!user) {
      return helper.sendError(403, res, { error: "User not found" }, req);
    }
    if (user.emailVerified) {
      return helper.sendError(
        403,
        res,
        { error: "Email already verified" },
        req
      );
    }

    await User.findOneAndUpdate(
      {
        _id: user._id,
      },

      {
        emailVerified: true,
        verifyToken: null,
      },
      {
        new: true,
      }
    );

    createSession(user, req, res, user.rememberMe);
  } catch (err) {
    return helper.sendError(500, res, { error: "Session Expired" }, req);
  }
};
