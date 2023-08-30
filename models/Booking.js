const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");


const bookingSchema = new Schema(
  {
    user: {
  type: Schema.Types.ObjectId,
  ref: "user",
    },  
    room: {
      details: {
        house: {
          // House-specific details
          address: {
            type: String,
            // required: true,
          },
          rooms: {
            type: Number,
            // required: true
          },
          kitchens: {
            type: Number,
            // required: true
          },
          washrooms: {
            type: Number,
            // required: true
          },
          price: {
            type: Number,
          },

          // ... other house-specific fields
        },
        hotel: {
          // Hotel-specific details
          name: {
            type: String,
            // required: true
          },
          stars: {
            type: Number,
            // required: true
          },
          room_number: {
            type: Number,
          },
          roomType: {
            type: String,
            // required: true,
            enum: ["standard", "deluxe", "suite"],
          },
          roomDescription: {
            type: String,
          },
          roomStatus: {
            type: String,
            // required: true,
            enum: ["vacant", "occupied", "maintenance", "out of order"],
          },
          roomPricePerHour: {
            type: Number,
            // required: true,
            // min: 0,
          },
          roomFeatures: {
            type: [String],
            // required: true,
            enum: ["Wi-Fi", "air conditioning", "mini-bar"],
          },
          // ... other hotel-specific fields
        },
        hostel: {
          // Hostel-specific details
          name: {
            type: String,
            // required: true,
          },
          roomPrice: {
            type: Number,
            // required: true,
            default: 0,
          },
          roomFeatures: {
            type: [String],

          },
          beds: {
            type: Number,
            default: 0,
            // required: true,
          },
          room_number: {
            type: Number,
          },
          roomType: {
            type: String,
            // required: true,
            enum: ["standard", "deluxe", "suite"],
          },
          roomDescription: {
            type: String,
          },
          roomStatus: {
            type: String,
            // required: true,
            enum: ["vacant", "occupied", "maintenance", "out of order"],
          },
          // ... other hostel-specific fields
        },
      },

      number: {
        type: Number,
      },
      images: {
        type: [String],
        required: true,
      },
      reserveFrom: {
        type: Date,
        required: false,
        validate: {
          validator: function (value) {
            return moment(value, moment.ISO_8601, true).isValid();
          },
          message: "Invalid date.",
        },
      },
      reserveTo: {
        type: Date,
        validate: {
          validator: function (value) {
            return moment(value, moment.ISO_8601, true).isValid();
          },
          message: "Invalid date.",
        },
      },

      type: {
        type: String,
        required: true,
        enum: ["hotel", "house", "hostel", "building"],
      },

      latitude: {
        type: Number,
        validate: {
          validator: function (value) {
            return /^-?([1-8]?[0-9]\.{1}\d{1,6}|90\.{1}0{1,6})$/.test(value);
          },
          message: "Invalid latitude value",
        },
      },
      longitude: {
        type: Number,
        validate: {
          validator: function (value) {
            return /^-?((1[0-7][0-9]|0?[0-9]{1,2})\.{1}\d{1,6}|180\.{1}0{1,6})$/.test(
              value
            );
          },
          message: "Invalid longitude value",
        },

      },
    },
    checkInDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return moment(value, moment.ISO_8601, true).isValid();
        },
        message: "Invalid date.",
      },
    },
    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return moment(value, moment.ISO_8601, true).isValid();
        },
        message: "Invalid date.",
      },
    },
    checkInTime: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
        message: "Invalid check-in time format",
      },
    },
    checkOutTime: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
        message: "Invalid check-out time format",
      },
    },
    verificationImages: {
      type:[String],
      required: true,
    },
    numberOfDays: {
      type: Number,
      default: 0,
    },
    reservedHours: {
      type: Number,
      required: true,
    },
    selfCleaning: {
      type: String,
      enum: ["Yes", "No"],
    },
    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },
    payment: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      paymentMethod: {
        type: String,
        enum: ["credit_card", "paypal", "cash"],
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["paid", "pending", "cancelled"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
