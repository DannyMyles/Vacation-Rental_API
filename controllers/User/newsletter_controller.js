const helper = require("../../helper/helper");
const NewsletterEmail = require("../../models/NewsletterEmail");
const { sendNewsletterConfirmationEmail } = require("../../utils/sendMail");

exports.subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;
  if (!helper.validateEmail(email)) {
    return helper.sendError(
      403,
      res,
      { error: "Please enter a valid email address." },
      req
    );
  }

  try {
    // Check if the email is already subscribed
    const existingEmail = await NewsletterEmail.findOne({ email });
    if (existingEmail) {
      return helper.sendError(
        403,
        res,
        { error: "Email already subscribed to the newsletter" },
        req
      );
    }

    // Create a new email subscription
    const newEmail = new NewsletterEmail({ email });
    await newEmail.save();

    await sendNewsletterConfirmationEmail(email);

    return helper.sendSuccess(
      res,
      { message: "You have Successfully subscribed to our newsletter." },
      req,
      "Success"
    );
  } catch (error) {
    console.log(error)
    return helper.sendError(500, res, { error: "Internal Server Error" }, req);
  }
};

exports.unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!helper.validateEmail(email)) {
      return helper.sendError(
        403,
        res,
        { error: "Please enter a valid email address." },
        req
      );
    }

    // Check if the email exists in the newsletter subscription list
    const existingEmail = await NewsletterEmail.findOne({ email });

    if (!existingEmail) {
      return helper.sendError(
        403,
        res,
        { error: "Email not subscribed to the newsletter" },
        req
      );
    }

    await NewsletterEmail.deleteOne({ email });

    return helper.sendSuccess(
      res,
      { message: "Successfully unsubscribed from the newsletter." },
      req,
      "Success"
    );
  } catch (error) {
    return helper.sendError(500, res, { error: "Internal Server Error" }, req);
  }
};
