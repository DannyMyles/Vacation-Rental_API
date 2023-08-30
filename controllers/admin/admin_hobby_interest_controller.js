const HobbyInterest = require("../../models/hobby_interest_model");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

exports.createHobbyInterest = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new Error(errors.array()[0].msg));
  }

  const { name } = req.body;

  try {
    const existingData = await HobbyInterest.findOne({ name });

    if (existingData) {
      return next(new Error("Hobby/Interest already exists"));
    }

    const hobbyInterest = new HobbyInterest({ name });

    const createdHobbyInterest = await hobbyInterest.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Hobby/Interest added",
      data: createdHobbyInterest,
    });
  } catch (err) {
    console.log(`ERROR :: createHobbyInterest :: ${err}`);
    next(err);
  }
};
