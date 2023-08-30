const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const amenitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
const Amenities = mongoose.model("amenity", amenitySchema);

module.exports = Amenities;
