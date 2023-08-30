const helper = require("../../helper/helper");
const Contact = require("../../models/Contact");
const { sendContactUsEmail } = require("../../utils/sendMail");

exports.contactUs = async (req, res, next) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !email || !message) {
      return helper.sendError(
        400,
        res,
        { error: "Please fill all the fields" },
        req
      );
    }
    await sendContactUsEmail(email, name, message);
    await Contact.create({
      name,
      email,
      message,
      phone: phone ? phone : "",
    });
    return helper.sendSuccess(
      res,
      "Your message has been sent successfully",
      req,
      "Suces"
    );
  } catch (error) {
    next(error);
  }
};
