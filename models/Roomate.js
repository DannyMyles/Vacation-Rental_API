const mongoose = require("mongoose");
const validator = require("validator");
const moment=require('moment')
const roomateShema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please enter your first name."],
    maxLength: [30, "Name cannot be exceeded 30 char."],
    minlength: [3, "Name should have more than 3 char."],
  },
  last_name: {
    type: String,
    required: [true, "Please enter your last name."],
    maxLength: [30, "Name cannot be exceeded 30 char."],
    minlength: [3, "Name should have more than 3 char."],
  },
  email: {
    type: String,
    required: [true, "Please enter your email."],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  bio: {
    type: String,
  },
  occupation: {
    type: String,
  },
  interests: {
    type: String,
  },
  language: {
    type: String,
  },
  memberSince: {
    type: Date,
    // required: [true, 'Date is required.'],
    validate: {
      validator: function (value) {
        return moment(value, moment.ISO_8601, true).isValid();
      },
      message: "Invalid date.",
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    required: true,
  },
  wishlist: {
    type: Array,
    default: [],
  },
  reviews: {
    type: Array,
    default: [],
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: Number,
    minlength: [10, "Phone number should be greater than 10 chars."],
  },
  images:{
    type:[String],
    default:[]
  },
  status: {
    type: Number,
    default: 1,
  },
});
module.exports = mongoose.model("roomate", roomateShema);
