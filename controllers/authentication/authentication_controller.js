const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const createSession = require("../../utils/createSession");
const Session = require("../../models/Session");
const { sendVerificationEmail } = require("../../utils/sendMail");
const sendOTP = require("../../utils/sendOTP");

exports.signup = async (req, res, next) => {
  console.log("SIGN UP BODY:", req);
  try {
    const { method, email, password, rememberMe } = req.body;
    if (!method) {
      return helper.sendError(403, res, { error: "Invalid method" }, req);
    }
    if (method === "custom_email") {
      if (!helper.validateEmail(email)) {
        return helper.sendError(
          403,
          res,
          { error: "Please enter a valid email address." },
          req
        );
      }
      if (!email) {
        return helper.sendError(
          403,
          res,
          { error: "Email address cannot be empty" },
          req
        );
      } else if (!password) {
        return helper.sendError(
          403,
          res,
          { error: "Please enter a password" },
          req
        );
      }

      const user = await User.findOne({ email });
      if (user) {
        return helper.sendError(
          403,
          res,
          { error: "This email already exists" },
          req
        );
      }

      if (!user) {
        // Validate other required fields for new user
        const userData = req.body;
        if (!userData.first_name) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid first name." },
            req
          );
        }

        if (!userData.last_name) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid last name." },
            req
          );
        }

        if (!userData.dob) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter date of birth." },
            req
          );
        }

        if (!userData.gender) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter gender." },
            req
          );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const new_user = await User.create({
          ...userData,
          dob: new Date(userData.dob),
          password: hashedPassword,
          rememberMe,
          role_id: 0,
        });

        const token = jwt.sign(
          { user_id: new_user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "5m",
          }
        );

        await User.findOneAndUpdate(
          { _id: new_user._id },
          { verifyToken: token },
          { new: true, runValidators: false, useFindAndModify: false }
        );
        await sendVerificationEmail(email, token);

        return helper.sendSuccess(res, "Email sent", req, "Success");
      }
    } else if (method === "custom_phone") {
      const userData = req.body;

      if (!userData.mobile) {
        return helper.sendError(
          403,
          res,
          { error: "Please enter a valid mobile number." },
          req
        );
      }

      if (!helper.validatePhone(userData.mobile)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      const user = await User.findOne({ mobile: userData.mobile });
      if (user) {
        return helper.sendError(
          403,
          res,
          { error: "This mobile number already exists" },
          req
        );
      }
      if (!user) {
        if (!userData.password) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid password." },
            req
          );
        }

        if (!userData.first_name) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid first name." },
            req
          );
        }

        if (!userData.last_name) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter a valid last name." },
            req
          );
        }

        if (!userData.dob) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter date of birth." },
            req
          );
        }

        if (!userData.gender) {
          return helper.sendError(
            403,
            res,
            { error: "Please enter gender" },
            req
          );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const response = await sendOTP(userData.mobile, "Your OTP is: ");
        if (response.success) {
          const new_user = await User.create({
            ...userData,
            dob: new Date(userData.dob),
            password: hashedPassword,
            rememberMe,
            role_id: 0,
          });

          const token = jwt.sign(
            { user_id: new_user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "3m",
            }
          );

          await User.findOneAndUpdate(
            { _id: new_user._id },
            { verifyToken: token },
            { new: true, runValidators: false, useFindAndModify: false }
          );

          return helper.sendSuccess(res, "OTP sent", req, "Success");
        } else {
          console.log("AUTH CONTROLLER ->", response);

          return helper.sendError(
            400,
            res,
            { error: "Failed to send OTP" },
            req
          );
        }
      }
    } else {
      return helper.sendError(400, res, { error: "Invalid method" }, req);
    }
  } catch (error) {
    console.error(error);
    return helper.sendError(500, res, { error: "An error occurred" }, req);
  }
};

// LOGIN USER
exports.login = async (req, res, next) => {
  const { email, password, method, mobile, rememberMe } = req.body;

  if (!method) {
    return helper.sendError(403, res, { error: "Invalid method" }, req);
  }

  if (method === "custom_email") {
    if (!helper.validateEmail(email)) {
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid email address." },
        req
      );
    }

    if (!email)
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid email address." },
        req
      );
    else if (!password)
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid password." },
        req
      );
    const user = await User.findOne({ email: email }).select("+password");
    if (!user)
      return helper.sendError(403, res, { error: "User not exists" }, req);

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return helper.sendError(403, res, { error: "Invalid Credentials" }, req);

    if (!user.emailVerified) {
      return helper.sendError(
        403,
        res,
        { error: "Please verify your email" },
        req
      );
    }

    await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        rememberMe: rememberMe,
      },
      {
        new: true,
      }
    );

    createSession(user, req, res, rememberMe);
  } else if (method === "custom_phone") {
    if (!helper.validatePhone(mobile)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
    if (!mobile)
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid phone number." },
        req
      );
    else if (!password)
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid password." },
        req
      );
    const user = await User.findOne({ mobile: mobile }).select("+password");
    if (!user)
      return helper.sendError(403, res, { error: "User not exists" }, req);
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return helper.sendError(403, res, { error: "Invalid Credentials" }, req);

    if (!user.mobileVerified) {
      return helper.sendError(
        403,
        res,
        { error: "Please verify your mobile" },
        req
      );
    }

    await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        rememberMe: rememberMe,
      },
      {
        new: true,
      }
    );

    createSession(user, req, res, rememberMe);
  }
};

exports.logout = catchAsyncFunc(async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader)
    return helper.sendError(
      403,
      res,

      { error: "Not authenticated" },
      req
    );
  const token = authHeader.split(" ")[1];
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const result = await Session.findOneAndDelete({ user: decodedToken.user_id });

  return helper.sendSuccess(res, result, req, "Success");
});
