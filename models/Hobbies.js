const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HobbySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hobby", HobbySchema);
