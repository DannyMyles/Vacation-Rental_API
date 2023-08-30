const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  getUserBooking,
  addBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
} = require("../../controllers/User/booking_controller");
const upload = require("../../utils/multerUpload");

router.get("/get_all_bookings", getAllBookings);
router.get("/get_user_bookings", getUserBooking);
router.post("/add_booking", upload, addBooking);
router.put("/update_booking",upload, updateBooking);
router.put("/cancel_booking", cancelBooking);
router.delete("/delete_booking", deleteBooking);

module.exports = router;
