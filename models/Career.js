const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    position: {
      type: String,
      required: true,
    },
    companyLocation: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },

    companyWebsiteURL: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Career = mongoose.model("career", careerSchema);
module.exports = Career;
