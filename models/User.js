const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const moment = require("moment");

const schema = new Schema(
  {
    googleId: String,
    facebookId: String,
    first_name: {
      type: Schema.Types.String,
      maxLength: [30, "Name cannot be exceeded 30 char."],
      minlength: [3, "Name should have more than 3 char."],
      required: true,
      trim: true,
    },
    rating: {
      type: Schema.Types.Number,
      default: 0,
    },
    last_name: {
      type: Schema.Types.String,
      maxLength: [30, "Name cannot be exceeded 30 char."],
      minlength: [3, "Name should have more than 3 char."],
      required: true,
      trim: true,
    },
    mobile: {
      type: Schema.Types.String,
      required: false,
      unique: true,
      sparse: true,
    },
    password: {
      type: Schema.Types.String,
      required: false,
    },
    identityVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    superHost: {
      type: Schema.Types.Boolean,
      default: false,
    },

    preferredLanguage: {
      type: Schema.Types.String,
      required: false,
    },
    
    userReviews: [
      {
        type: Schema.Types.String,
      },
    ],
    occupation: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      required: false,
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
    gender: {
      type: Schema.Types.String,
      required: false,
    },
    profilePic: {
      type: Schema.Types.String,
      required: false,
    },
    hobbiesInterests: {
      type: Schema.Types.Array,
      required: false,
      default: [],
    },
    age: {
      type: Number,
      required: false,
      min: [1, "Age should be greater than 0."],
      max: [100, "Age should be less than 110."],
    },
    fcmToken: {
      type: Schema.Types.String,
      required: false,
      default: "",
    },
    country: {
      type: String,
    },
    email: {
      type: Schema.Types.String,
      required: false,
      unique: true,
      sparse: true,
    },
    emailVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },

    mobileVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isBlocked: {
      type: Schema.Types.Boolean,
      default: false,
    },

    verifyToken: {
      type: Schema.Types.String,
      default: null,
    },
    resetToken: {
      type: Schema.Types.String,
      default: null,
    },
    rememberMe: {
      type: Schema.Types.Boolean,
      default: false,
    },
    paymentHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentHistory",
      required: false,
    },
    about: {
      type: String,
      required: false,
    },

    partnerHostings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartnerHosting",
      },
    ],
    role_id: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
