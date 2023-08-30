const helper = require("../helper/helper");
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");

async function createSession(user, req, res, rememberMe) {
  const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "7d" : "2d",
  });

  const exist_session = await Session.findOne({ user: user._id });

  if (exist_session) {
    await Session.findOneAndUpdate(
      { _id: exist_session._id },
      {
        token: token,
        expiresAt: new Date(Date.now() + process.env.SESSION_EXPIRES_IN * 1000),
      },
      {
        new: true,
        runValidators: false,
        userFindANdModify: false,
      }
    );

    const userDetails = {
      token,
      profilePic: user.profilePic,
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user._id,
      role_id: user.role_id,
    };

    return helper.sendSuccess(res, userDetails, req, "Success");
  } else {
    const session = new Session({
      user: user._id,
      token: token,
      expiresAt: new Date(Date.now() + process.env.SESSION_EXPIRES_IN * 1000),
    });

    await session.save();
    const userDetails = {
      token,
      profilePic: user.profilePic,
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user._id,
      role_id: user.role_id,
    };
    return helper.sendSuccess(res, userDetails, req, "Success");
  }
}

module.exports = createSession;
