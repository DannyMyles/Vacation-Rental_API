const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    paymentInfo: [{
        method: {
            type: String,
            required: true,
            enum: ["creditcard", "netbanking"],
        },
        details: {
            type: String,
            default: "",
        },
        preferred: {
            type: Boolean,
            default: false,
        },
    }],
    notification: {
        generalNotification: {
            type: String,
            default: "on",
            enum: ["on", "off"],
        },
        sound: {
            type: String,
            default: "on",
            enum: ["on", "off"],
        },
        vibration: {
            type: String,
            default: "on",
            enum: ["on", "off"],
        },
        addUpdates: {
            type: String,
            default: "on",
            enum: ["on", "off"],
        },
    },
    preferredCurrency: {
        type: String,
        required: true,
        enum: ["USD", "EURO", "INR"],
    },
});

const UserSettings = mongoose.model("Settings", settingsSchema);

module.exports = UserSettings;
