const Settings = require("../../models/UserSettings");

// Update user payment info
const updatePaymentInfo = async (req, res) => {
  const { userId } = req.params;
  const { method, details, preferred } = req.body;

  try {
    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        $set: {
          "paymentInfo.$[elem].method": method,
          "paymentInfo.$[elem].details": details,
          "paymentInfo.$[elem].preferred": preferred,
        },
      },
      { arrayFilters: [{ "elemF._id": { $exists: true } }] }
    );
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    return res.json({ message: "Payment info updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user notification settings
const updateNotificationSettings = async (req, res) => {
  const { userId } = req.params;
  const { generalNotification, sound, vibration, addUpdates } = req.body;

  try {
    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        $set: {
          "notification.generalNotification": generalNotification,
          "notification.sound": sound,
          "notification.vibration": vibration,
          "notification.addUpdates": addUpdates,
        },
      }
    );
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    return res.json({ message: "Notification settings updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user currency
const updateCurrency = async (req, res) => {
  const { userId } = req.params;
  const { currency } = req.body;

  try {
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: { currency } }
    );
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    return res.json({ message: "Currency updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updatePaymentInfo,
  updateNotificationSettings,
  updateCurrency,
};
