const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["bedrooms", "bathrooms", "livingrooms", "kitchens"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", roomSchema);
