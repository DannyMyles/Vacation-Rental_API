const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    mobile: {
      type: Schema.Types.String,
      required: true,
    },
    otp: {
      type: Schema.Types.String,
      required: true,
    },

    messageSid: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", schema);
