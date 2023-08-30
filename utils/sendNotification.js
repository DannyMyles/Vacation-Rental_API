const { adminApp } = require("../config/firebase");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { getMessaging } = require("firebase-admin/messaging");

exports.sendNotification = async (message, title, data, user) => {
  if (!user) {
    return {
      success: false,
      message: "Please provide a user id",
    };
  }

  const checkUser = await User.findById(user);

  if (!checkUser) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const checkFCM = checkUser.fcmToken;
  if (!checkFCM) {
    return {
      success: false,
      message: "FCM Token not found",
    };
  }
  const registrationToken = checkFCM;

  const payload = {
    token: registrationToken,
    notification: {
      title,
      body: message,
    },

    data,
  };

  try {
    await getMessaging(adminApp).send(payload);
    await Notification.create({
      user,
      title,
      message,
      token: registrationToken,
      images: data.images,
    });

    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
