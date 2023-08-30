const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [
    {
      type: String,
      required: true,
      enum: ["admin", "hotel_manager", "receptionist", "guest", "staff"],
    },
  ],
  status: {
    type: Number,
    default: 1,
    enum: [0, 1],
  },
});

const Role = mongoose.model("role", roleSchema);

module.exports = Role;
