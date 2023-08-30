const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const moment = require("moment");
const PriceTimelineOptions = ["hourly", "daily", "monthly"];

const ParnterHosting = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    placeType: {
      type: String,
      enum: ["Entire house", "Shared Room", "Single Room"],
      required: true,
    },

    guests: {
      type: Number,
      max: [10, "Guests cannot be more than 10."],
      min: [1, "Guests cannot be less than 1."],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Both can stay"],
      required: true,
    },
    pets: {
      type: Boolean,
      required: true,
    },
    smoking: {
      type: Boolean,
      required: true,
    },

    interestsUserHave: {
      type: [String],
      required: true,
    },
    interestsUserLookingFor: {
      type: [String],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return moment(value, moment.ISO_8601, true).isValid();
        },
        message: "Invalid date.",
      },
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return moment(value, moment.ISO_8601, true).isValid();
        },
        message: "Invalid date.",
      },
    },

    images: {
      type: [String],
      default: [],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    priceTimeline: {
      type: String,
      required: true,
      enum: PriceTimelineOptions,
    },

    price: {
      type: Number,
      require: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PartnerHosting", ParnterHosting);
