const mongoose = require("mongoose");

const NewsletterEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsletterEmail = mongoose.model(
  "NewsletterEmail",
  NewsletterEmailSchema
);

module.exports = NewsletterEmail;
