const mongoose = require("mongoose");
const Review = require("./Review");
const dailyPriceSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },
  price: { type: Number, required: true },
});

const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
  zipCode: { type: String },
  imageUrls: [{ type: String }],
  dailyPrices: [dailyPriceSchema],
  type: {
    type: String,
    enum: ["entire-house", "shared-room", "single-room"],
    default: "any-type",

    required: true,
  },

  cleaningFee: { type: Number, required: true },

  propertyType: {
    type: String,
    enum: ["house", "guesthouse", "flat", "hotel", "apartment"],
  },

  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenities",
    },
  ],
  isReported: { type: Boolean, default: false },
  bedRooms: {
    type: Number,
    required: true,
  },
  bathRooms: {
    type: Number,

    required: true,
  },
  distanceFromCenter: { type: Number },
  reviews: [Review.schema],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  cohosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  biddingPrice: { type: Number, required: true },

  flexibleCheckIn: { type: Boolean, default: false },
  flexibleCheckOut: { type: Boolean, default: false },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  guestsMax: { type: Number, required: true },
  mininumNights: { type: Number, required: true },
  maximumNights: { type: Number, required: true },

  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  beds: {
    type: Number,
    required: true,
  },

  cancellationPolicy: {
    type: String,
  },

  availableStartDate: {
    type: Date,

    validate: {
      validator: function (value) {
        if (value) {
          return moment(value, moment.ISO_8601, true).isValid();
        }
        return true;
      },
      message: "Invalid date.",
    },
  },
  availableEndDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (value) {
          return moment(value, moment.ISO_8601, true).isValid();
        }
        return true;
      },
      message: "Invalid date.",
    },
  },
}, {
  timestamps: true,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
