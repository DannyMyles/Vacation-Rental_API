const Session = require("../models/Session");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getAuth } = require("firebase-admin/auth");
const { adminApp } = require("../config/firebase");
const helper = require("../helper/helper");
const createSession = require("../utils/createSession");


const verifyGoogleAuth = async (req, res, next) => {
  const auth = getAuth(adminApp);
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return helper.sendError(
      403,
      res,
      { error: "Authorization header missing" },
      req
    );
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return helper.sendError(403, res, { error: "Token missing" }, req);
  }

  try {
    const result = await auth.verifyIdToken(token);
    const checkUserExists = await User.findOne({
      email: result.email
    })
    if (checkUserExists) {
      createSession(checkUserExists, req, res, false);
      return;
    }

    const { email, email_verified, name, picture } = result;
    const newUser = await User.create({
      email,
      emailVerified: email_verified,
      first_name: name.split(" ")[0],
      last_name: name.split(" ")[1],
      role_id: 0,
      profilePic: picture,
    });

    createSession(newUser, req, res, true);
  } catch (err) {
    console.log(err);
    return helper.sendError(403, res, { error: err.message }, req);
  }
};


const verifyFacebookAuth = async (req, res, next) => {
  const auth = getAuth(adminApp);
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return helper.sendError(
      403,
      res,
      { error: "Authorization header missing" },
      req
    );
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return helper.sendError(403, res, { error: "Token missing" }, req);
  }

  try {
    const result = await auth.verifyIdToken(token);
    const checkUserExists = await User.findOne({
      email: result.email
    })
    if (checkUserExists) {
      createSession(checkUserExists, req, res, true);
      return;
    }

    const { email, email_verified, name, picture } = result;
    const newUser = await User.create({
      email,
      emailVerified: email_verified,
      first_name: name.split(" ")[0],
      last_name: name.split(" ")[1],
      role_id: 0,
      profilePic: picture,
    });

    createSession(newUser, req, res, true);
  } catch (err) {
    console.log(err);
    return helper.sendError(403, res, { error: err.message }, req);
  }
}

const verifyAppleAuth = async (req, res, next) => {
  const auth = getAuth(adminApp);

  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return helper.sendError(403, res, { error: "Authorization header missing" }, req);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return helper.sendError(403, res, { error: "Token missing" }, req);
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    const checkUserExists = await User.findOne({
      email: decodedToken.email,
    });

    if (checkUserExists) {
      createSession(checkUserExists, req, res, true);
      return;
    }

    const { email, email_verified, name, picture } = decodedToken;
    const newUser = await User.create({
      email,
      emailVerified: email_verified,
      first_name: name.split(" ")[0],
      last_name: name.split(" ")[1],
      role_id: 0,
      profilePic: picture,
    });

    createSession(newUser, req, res, true);
  } catch (err) {
    console.error(err);
    return helper.sendError(403, res, { error: err.message }, req);
  }
};


module.exports = {
  verifyFacebookAuth,
  verifyAppleAuth,
  verifyGoogleAuth,
};



