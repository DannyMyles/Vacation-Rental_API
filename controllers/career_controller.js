const helper = require("../helper/helper");
const Career = require("../models/Career");
const { sendJobApplicationEmail } = require("../utils/sendMail");

const requiredFields = [
  "first_name",
  "last_name",
  "email",
  "position",
  "companyLocation",
  "companyWebsiteURL",
  "message",
  "title",
  "companyName",
];

exports.applyForJob = async (req, res) => {
  const careerBody = req.body;
  if (
    !requiredFields.every((field) => Object.keys(careerBody).includes(field))
  ) {
    return helper.sendError(
      400,
      res,
      {
        error: `Required fields are missing: ${requiredFields.filter(
          (field) => !Object.keys(careerBody).includes(field)
        )}`,
      },
      req
    );
  }
  await sendJobApplicationEmail(careerBody);
  const career = await Career.create(careerBody);
  return helper.sendSuccess(res, career, req, "Success");
};
