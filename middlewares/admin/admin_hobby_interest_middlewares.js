const { body } = require("express-validator");

const createHobbyInterestValidators = body("name", "Hobby/Interest is required")
  .exists({ checkNull: true })
  .trim()
  .notEmpty();

module.exports = { createHobbyInterestValidators };
