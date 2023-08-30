const express = require('express');
const router = express.Router();
const { updatePaymentInfo, updateNotificationSettings, updateCurrency } = require("../../controllers/User/user_settings_controller");

// Update user payment info
router.put('/settings/payment-info/:userId', updatePaymentInfo);

// Update user notification settings
router.put('/settings/notification/:userId', updateNotificationSettings);

// Update user currency
router.put('/settings/currency/:userId', updateCurrency);

module.exports = router;
