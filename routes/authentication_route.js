const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  logout,
} = require("../controllers/authentication/authentication_controller");
const {
  sendotp,
  verifyotp,
} = require("../controllers/authentication/otp_controller");
const {
  forgotPassword,
  resetPassword,
  verfiyResetPasswordOTP,
} = require("../controllers/authentication/password_controller");
const {
  verifyEmail,
  verifyEmailToken,
} = require("../controllers/authentication/verify_email_controller");
const {
  verifyGoogleAuth,
  verifyFacebookAuth,
  verifyAppleAuth,
} = require("../controllers/providers_controller");

router.post("/login", login);

router.post("/send-otp", sendotp);

router.post("/verify-otp", verifyotp);

router.post("/verify-email", verifyEmail);

router.get("/verify-email/:token", verifyEmailToken);

router.post("/signup", signup);
router.get("/getuser");

router.delete("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", verfiyResetPasswordOTP);
router.post("/reset-password", resetPassword);

router.post("/google", verifyGoogleAuth);
router.post("/facebook", verifyFacebookAuth);
router.post("/apple", verifyAppleAuth);

module.exports = router;
