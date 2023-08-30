const OTP = require("../models/OTP");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = async (mobile, otpMessage) => {
  let otp_code = Math.floor(Math.random() * 900000);

  try {
    const message = await client.messages.create({
      body: `${otpMessage}` + otp_code,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    const otpResponse = await OTP.create({
      mobile: mobile,
      otp: otp_code,
      messageSid: message.sid,
    });

    if (otpResponse) {
      return {
        success: true,
        msg: "OTP sent successfully",
      };
    }
  } catch (err) {
    return {
      success: false,
      msg: err.message,
    };
  }
};

module.exports = sendOTP;